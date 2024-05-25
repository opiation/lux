import { Box, Heading } from "@chakra-ui/react"
import AccountList from "./components/AccountList"
import AccountEditForm from "./components/AccountEditForm"
import { useState } from "react"
import { Account } from "./schema.js"

function App() {
  const [accounts, setAccounts] = useState((): Array<Account> => [])
  return (
    <Box alignItems="center" display="flex" flex={1} flexDirection="column">
      <Heading>Lux</Heading>
      <AccountEditForm onSubmit={newAccount => setAccounts(current => [...current, newAccount])} />
      <AccountList accounts={accounts} />
    </Box>
  )
}

export default App
