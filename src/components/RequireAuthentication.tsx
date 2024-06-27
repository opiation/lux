import { type ReactNode, createContext, useContext } from "react";
import { useAuth } from "react-oidc-context";
import type { User } from "oidc-client-ts";
import { Button, Text } from "@chakra-ui/react";

const UserSession = createContext<User | null>(null);
UserSession.displayName = "UserSession";

export type RequireAuthenticationProps = {
  children?: ReactNode | ((userSession: User) => ReactNode);
};

export function useUserSession(): User {
  const currentSession = useContext(UserSession);
  if (!currentSession) {
    throw new Error(
      "No user session found. Is there a parent component providing a user session (e.g.: `<RequireAuthentication />`)?"
    );
  }

  return currentSession;
}

/**
 * Require the user to be authenticated before accessing any children of this
 * component.
 */
export function RequireAuthentication(props: RequireAuthenticationProps) {
  const auth = useAuth();

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <Text>Signing you in...</Text>;
    case "signoutRedirect":
      return <Text>Signing you out...</Text>;
  }

  if (auth.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (auth.error) {
    return <Text>Oops... {auth.error.message}</Text>;
  }

  if (auth.isAuthenticated) {
    if (!auth.user) {
      return <Text>Oops... no user found.</Text>;
    }

    if (typeof props.children === "function") {
      return <>{props.children(auth.user)}</>;
    } else {
      return (
        <UserSession.Provider value={auth.user}>
          {props.children}
        </UserSession.Provider>
      );
    }
  }

  return <Button onClick={() => void auth.signinRedirect()}>Log in</Button>;
}
