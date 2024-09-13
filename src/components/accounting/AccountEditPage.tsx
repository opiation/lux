import { Text } from "@chakra-ui/react";
import { skipToken } from "@tanstack/react-query";
import { Account } from "../../core/accounting/schema.js";
import { trpc } from "../../trpc.ts";
import AccountEditForm from "./AccountEditForm.tsx";

type AccountEditPageProps = {
  /**
   * If provided, the account being edited is expected to exist, is fetched and
   * its current data are overriden with any `initialState` if provided.
   */
  existingAccountId?: string;

  /**
   * If provided, the form is initialized with these values.
   */
  initialState?: Partial<Account>;
};

export default function AccountEditPage(props: AccountEditPageProps) {
  const { existingAccountId, initialState } = props;

  const accountQuery = trpc.accounting.account.useQuery(
    existingAccountId ?? skipToken,
  );

  return (
    <>
      <h1>Edit Account</h1>
      {existingAccountId ? (
        <>
          {accountQuery.isLoading && (
            <Text>Loading account {existingAccountId}...</Text>
          )}
          {!accountQuery.isLoading && accountQuery.error && (
            <Text>
              Error loading account information: {accountQuery.error.message}
            </Text>
          )}
          {!accountQuery.isLoading && accountQuery.data && (
            <AccountEditForm account={accountQuery.data} />
          )}
        </>
      ) : (
        <AccountEditForm account={initialState} />
      )}
    </>
  );
}
