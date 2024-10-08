import {
  Box,
  CircularProgress,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { WebStorageStateStore } from "oidc-client-ts";
import { AuthProvider } from "react-oidc-context";
import { Outlet } from "react-router-dom";
import { AppConfiguration } from "./app-configuration.js";
import { NavigationMenu } from "./components/NavigationMenu.js";
import { Suspense } from "react";

/** Client Id of the Lux front-end application according to Medplum */
// const LUX_MEDPLUM_CLIENT_ID = "5fc0ad69-d212-4712-a13f-f977aba3587b";
// const MEDPLUM_TOKEN_ENDPOINT = "http://localhost:8103/oauth2/token";

export type AppProps = {
  configuration?:
    | AppConfiguration
    | ((defaultConfig: AppConfiguration) => Promise<AppConfiguration>);
};

export function App(props: AppProps) {
  const redirectURI = `${location.protocol}//${location.host}/`;

  return (
    <AppConfiguration.ProviderWithManualFallback value={props.configuration}>
      <AuthProvider
        authority="http://localhost:8080/realms/heliopolis"
        client_id="lux-frontend"
        redirect_uri={redirectURI}
        stateStore={new WebStorageStateStore({ store: window.localStorage })}
      >
        <VStack align="left" marginX="20%">
          <Heading>Lux</Heading>
          <HStack alignItems="start">
            <VStack align="left" width={200}>
              <NavigationMenu />
            </VStack>
            <Box display="flex" flex={1} flexDirection="column">
              <Suspense
                fallback={
                  <CircularProgress isIndeterminate>
                    Loading...
                  </CircularProgress>
                }
              >
                <Outlet />
              </Suspense>
            </Box>
          </HStack>
        </VStack>
      </AuthProvider>
    </AppConfiguration.ProviderWithManualFallback>
  );
}
