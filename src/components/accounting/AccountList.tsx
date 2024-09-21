import { Flex, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { Account } from "../../core/accounting/schema.js";
import { actions, useSelector } from "../../core/accounting/store.ts";
import { AccountInlineActions } from "./AccountInlineActions.tsx";

const { deleteAccounts, renameAccount } = actions;

type AccountListProps = {
  accounts?: Array<Account>;
  onDeleteInline?(accountDeletion: ReturnType<typeof deleteAccounts>): void;
  onRenameInline?(accountRename: ReturnType<typeof renameAccount>): void;
};

function AccountList(props: AccountListProps) {
  const accountMap = useSelector((accounting) => accounting.accounts);
  const accounts = accountMap ? Object.values(accountMap) : undefined;

  const accountsToDisplay = useMemo(
    () => props.accounts ?? accounts ?? [],
    [props.accounts, accounts],
  );

  return (
    <table>
      <tbody>
        {accountsToDisplay.map((a) => (
          <tr key={a.id}>
            <td>
              <Text>{a.name}</Text>
            </td>
            <td>
              <Text>({a.id})</Text>
            </td>
            <td style={{ display: "flex", justifyContent: "end" }}>
              <AccountInlineActions
                account={a}
                onDelete={props.onDeleteInline}
                onRename={props.onRenameInline}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AccountList;
