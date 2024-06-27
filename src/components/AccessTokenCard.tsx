import {
  Card,
  CardBody,
  CardHeader,
  Code,
  Heading,
  HStack,
  Text,
} from "@chakra-ui/react";
import type { User } from "oidc-client-ts";

type AccessTokenCardProps = {
  accessTokenResponse: User;
};

export function AccessTokenCard({ accessTokenResponse }: AccessTokenCardProps) {
  const displayName =
    accessTokenResponse.profile?.preferred_username ??
    accessTokenResponse.profile?.nickname ??
    accessTokenResponse.profile?.email ??
    "Unnamed user";

  return (
    <Card>
      <CardHeader>
        <Heading as="h4" size="md">
          Token response for the current session
        </Heading>
      </CardHeader>
      <CardBody>
        {accessTokenResponse.profile?.sub && (
          <HStack key="profile-sub">
            <Text>Sub</Text>
            <Code>{accessTokenResponse.profile?.sub}</Code>
          </HStack>
        )}
        <HStack key="display-name">
          <Text>Displayed Name</Text>
          <Code>{displayName}</Code>
        </HStack>
        <HStack key="access-token">
          <Text>Access token</Text>
          <Code textOverflow={"ellipsis"}>
            {accessTokenResponse.access_token.slice(0, 20)}...
          </Code>
        </HStack>
        {accessTokenResponse.profile?.iss && (
          <HStack key="issuer">
            <Text title="Which entity issued this access token?">Issuer</Text>
            <Code>{accessTokenResponse.profile?.iss}</Code>
          </HStack>
        )}
      </CardBody>
    </Card>
  );
}
