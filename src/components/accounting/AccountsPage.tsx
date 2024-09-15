import { CircularProgress, Text } from "@chakra-ui/react";
import { trpc } from "../../trpc.ts";
import AccountList from "./AccountList.tsx";

/**
 * A complete in the `Accounting` application that displays a list of all the
 * accounts visible to the current user.
 */
export default function AccountsPage() {
  const accountsQuery = trpc.accounting.accounts.useQuery();

  return (
    <>
      <Text size="lg">Accounts</Text>
      {accountsQuery.isLoading && <CircularProgress isIndeterminate />}
      {accountsQuery.error && <Text>{accountsQuery.error.message}</Text>}
      {accountsQuery.data && accountsQuery.data.length > 0 && (
        <AccountList></AccountList>
      )}
    </>
  );
}
