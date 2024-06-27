import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";

const GrantType = {
  /** @see https://datatracker.ietf.org/doc/html/rfc8693 */
  TokenExchange: "urn:ietf:params:oauth:grant-type:token-exchange",
} as const;

/** @see https://datatracker.ietf.org/doc/html/rfc8693#TokenTypeIdentifiers */
const TokenType = {
  AccessToken: "urn:ietf:params:oauth:token-type:access_token",
} as const;

/**
 * @see https://datatracker.ietf.org/doc/html/rfc8693#name-successful-response
 */
export const TokenExchangeSuccessResponseBody = z
  .object({
    /**
     * The security token issued by the authorization server in response to the
     * token exchange request. The access_token parameter from Section 5.1 of
     * [RFC6749] is used here to carry the requested token, which allows this
     * token exchange protocol to use the existing OAuth 2.0 request and response
     * constructs defined for the token endpoint. The identifier `access_token`
     * is used for historical reasons and the issued token need not be an OAuth
     * access token.
     */
    access_token: z.string().trim().min(1),

    /**
     *  The validity lifetime, in seconds, of the token issued by the
     * authorization server. Oftentimes, the client will not have the inclination
     * or capability to inspect the content of the token, and this parameter
     * provides a consistent and token-type-agnostic indication of how long the
     * token can be expected to be valid. For example, the value 1800 denotes
     * that the token will expire in thirty minutes from the time the response
     * was generated.
     */
    expires_in: z.number().optional().nullish(),

    /**
     * An identifier, as described in Section 3, for the representation of the
     * issued security token.
     *
     * @note This is often expected to be an access token
     * @see {@link TokenType}
     * @todo This should be required as per the RFC
     */
    issued_token_type: z.string().trim().min(1).optional().nullish(),

    /**
     * A refresh token will typically not be issued when the exchange is of one
     * temporary credential (the `subject_token`) for a different temporary
     * credential (the issued token) for use in some other context. A refresh
     * token can be issued in cases where the client of the token exchange needs
     * the ability to access a resource even when the original credential is no
     * longer valid (e.g., user-not-present or offline scenarios where there is
     * no longer any user entertaining an active session with the client).
     * Profiles or deployments of this specification should clearly document the
     * conditions under which a client should expect a refresh token in response
     * to `urn:ietf:params:oauth:grant-type:token-exchange` grant type requests.
     */
    refresh_token: z.string().trim().min(1).optional().nullish(),

    /**
     * OPTIONAL if the scope of the issued security token is identical to the
     * scope requested by the client; otherwise, it is REQUIRED.
     */
    scope: z.string().trim().min(1).optional().nullish(),

    /**
     * A case-insensitive value specifying the method of using the access token
     * issued, as specified in Section 7.1 of [RFC6749]. It provides the client
     * with information about how to utilize the access token to access protected
     * resources. For example, a value of Bearer, as specified in [RFC6750],
     * indicates that the issued security token is a bearer token and the client
     * can simply present it as is without any additional proof of eligibility
     * beyond the contents of the token itself. Note that the meaning of this
     * parameter is different from the meaning of the `issued_token_type`
     * parameter, which declares the representation of the issued security token;
     * the term "token type" is more typically used to mean the structural or
     * syntactical representation of the security token, as it is in all
     * `*_token_type` parameters in this specification. If the issued token is
     * not an access token or usable as an access token, then the token_type
     * value `N_A` is used to indicate that an OAuth 2.0 `token_type` identifier
     * is not applicable in that context.
     */
    token_type: z.string().trim().min(1),
  })
  // Allow additional properties to be passed through in the token reponse
  // because some providers (e.g.: Medplum) attach additional information to
  // the token response such as Patient Id or Practitioner Id.
  .passthrough();
export type TokenExchangeSuccessResponseBody = z.infer<
  typeof TokenExchangeSuccessResponseBody
> &
  Record<string, unknown>;

type TokenExchangerProps<
  TokenSchema extends
    TokenExchangeSuccessResponseBody = TokenExchangeSuccessResponseBody,
> = {
  /**
   * The access token to be exchanged
   */
  accessToken: string;

  /**
   * Children who can use the exchanged token
   */
  children?(receivedTokenResponse: TokenSchema): ReactNode;

  /** Identifier for the Cascade `ClientApplication` application in Medplum */
  clientId: string;

  /** Optional renderer invoked when the token exchange fails */
  onError?(reason: string, setResult: (result: TokenSchema) => void): ReactNode;

  /** Can be used to show a message while the token exchange is in progress */
  pending?(
    message: string,
    setResult: (result: TokenSchema) => void
  ): ReactNode;

  /**
   * URL for the token endpoint of the Medplum server
   *
   * @example "https://api.medplum.com/oauth2/token"
   */
  tokenEndpoint: string;

  /**
   * Function used to parse the successful token exchange response JSON body.
   * If omitted, the default parser for the type
   * {@link TokenExchangeSuccessResponseBody} will be used. Parsers should
   * throw errors if the response is not in the expected format.
   */
  tokenPayloadParser?: (tokenResponse: unknown) => TokenSchema;
};

export function TokenExchanger<
  TokenSchema extends
    TokenExchangeSuccessResponseBody = TokenExchangeSuccessResponseBody,
>(props: TokenExchangerProps<TokenSchema>) {
  const {
    accessToken,
    children,
    clientId,
    onError,
    pending,
    tokenEndpoint,
    tokenPayloadParser = TokenExchangeSuccessResponseBody.parse,
  } = props;

  const [result, setResult] = useState<TokenSchema>();

  const tokenExchange = useQuery({
    queryKey: [
      "exchangeToken",
      accessToken,
      clientId,
      tokenEndpoint,
      tokenPayloadParser,
    ] as const,
    queryFn({ queryKey }) {
      return exchangeToken(queryKey[1], queryKey[2], queryKey[3]);
    },
    retry(failureCount) {
      return failureCount < 3;
    },
    select: tokenPayloadParser,
  });

  if (result) {
    return <>{children?.(result)}</>;
  }

  switch (tokenExchange.status) {
    case "error":
      return (
        <>
          {typeof onError === "function" &&
            onError(tokenExchange.error.message, setResult)}
        </>
      );

    case "pending":
      return (
        <>
          {typeof pending === "function" &&
            pending("Authenticating...", setResult)}
        </>
      );

    case "success":
      return (
        <>
          {typeof children === "function" &&
            children(tokenExchange.data as unknown as TokenSchema)}
        </>
      );
  }
}

type TokenResponseFormProps<
  TokenSchema extends
    TokenExchangeSuccessResponseBody = TokenExchangeSuccessResponseBody,
> = {
  onAbort?: () => void;
  onSubmit?: (response: TokenSchema) => void;
};

/**
 * This exists as an escape hatch for developers and should not be used outside
 * of development environments.
 */
export function TokenResponseForm<
  TokenSchema extends
    TokenExchangeSuccessResponseBody = TokenExchangeSuccessResponseBody,
>(props: TokenResponseFormProps<TokenSchema>) {
  const { onAbort, onSubmit } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const submitManualToken = useCallback(() => {
    if (typeof onSubmit !== "function") return;

    const forcedToken = inputRef.current?.value;
    if (!forcedToken) throw new Error("No token provided");

    if (forcedToken.startsWith("{")) {
      onSubmit(JSON.parse(forcedToken));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit({ access_token: forcedToken } as any);
    }
  }, [inputRef, onSubmit]);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "4px" }}>
      <input placeholder="access token..." ref={inputRef} type="text"></input>
      <button onClick={submitManualToken}>Submit</button>
      {typeof onAbort === "function" && (
        <button onClick={onAbort}>Abort</button>
      )}
    </div>
  );
}

function exchangeToken(
  accessToken: string,
  clientId: string,
  tokenEndpoint: string,
  abortSignal?: AbortSignal
) {
  const tokenExchangeRequestBody = new URLSearchParams();
  tokenExchangeRequestBody.set("client_id", clientId);
  tokenExchangeRequestBody.set("grant_type", GrantType.TokenExchange);
  tokenExchangeRequestBody.set("subject_token", accessToken);
  tokenExchangeRequestBody.set("subject_token_type", TokenType.AccessToken);

  return fetch(tokenEndpoint, {
    body: tokenExchangeRequestBody.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    signal: abortSignal,
  }).then<unknown>((response) => {
    if (response.status !== 200 && response.status !== 201) {
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        return response.json().then((jsonBody) => {
          console.warn(`Failed to exchange token: `, jsonBody);
          throw `Failed to exchange token: ${JSON.stringify(jsonBody, null, 2)}`;
        });
      }

      throw response.statusText;
    }
    if (!response.ok) throw response.statusText;

    return response.json();
  });
}
