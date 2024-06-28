import { Box, Heading } from "@chakra-ui/react";
import { WebStorageStateStore } from "oidc-client-ts";
import { useState } from "react";
import { AuthProvider } from "react-oidc-context";
import { Outlet } from "react-router-dom";
import { AppConfiguration } from "./app-configuration.js";
import { MealPlanGenerator } from "./components/meal-planner/MealPlanGenerator.tsx";

/** Client Id of the Lux front-end application according to Medplum */
// const LUX_MEDPLUM_CLIENT_ID = "5fc0ad69-d212-4712-a13f-f977aba3587b";
// const MEDPLUM_TOKEN_ENDPOINT = "http://localhost:8103/oauth2/token";

type AppProps = {
  configuration?:
    | AppConfiguration
    | ((defaultConfig: AppConfiguration) => Promise<AppConfiguration>);
};

function App(props: AppProps) {
  const redirectURI = `${location.protocol}//${location.host}/`;

  return (
    <AppConfiguration.ProviderWithManualFallback value={props.configuration}>
      <AuthProvider
        authority="http://localhost:8080/realms/heliopolis"
        client_id="lux-frontend"
        redirect_uri={redirectURI}
        stateStore={new WebStorageStateStore({ store: window.localStorage })}
      >
        <Box
          alignItems="center"
          display="flex"
          flex={1}
          flexDirection="column"
        >
          <Heading>Lux</Heading>
          <Outlet />
        </Box>
      </AuthProvider>
    </AppConfiguration.ProviderWithManualFallback>
  );
}

export default App;
