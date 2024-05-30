import { Box, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AccountList from "./components/AccountList";
import AccountEditForm from "./components/AccountEditForm";
import { Account } from "./schema.js";
import { AppConfiguration } from "./app-configuration.js";

type AppProps = {
  configuration?:
    | AppConfiguration
    | ((defaultConfig: AppConfiguration) => Promise<AppConfiguration>);
};

function App(props: AppProps) {
  const [accounts, setAccounts] = useState((): Array<Account> => []);

  return (
    <AppConfiguration.ProviderWithManualFallback value={props.configuration}>
      <Box alignItems="center" display="flex" flex={1} flexDirection="column">
        <Heading>Lux</Heading>
        <Outlet />
        <AccountEditForm
          onSubmit={(newAccount) =>
            setAccounts((current) => [...current, newAccount])
          }
        />
        <AccountList accounts={accounts} />
      </Box>
    </AppConfiguration.ProviderWithManualFallback>
  );
}

export default App;
