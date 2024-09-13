import { Stack, Text } from "@chakra-ui/react";
import { Account, account } from "../../schema.js";
import { useMemo, useState } from "react";

type AccountListProps = {
  accounts?: Array<Account>;
};

function AccountList(props: AccountListProps) {
  const [accounts] = useState(
    (): Array<Account> => props.accounts ?? [account(), account()],
  );

  const accountsToDisplay = useMemo(
    () => props.accounts ?? accounts,
    [props.accounts, accounts],
  );

  return (
    <Stack direction="column">
      {accountsToDisplay.map((a) => (
        <Stack direction="row" key={a.id}>
          <Text>{a.name}</Text>
          <Text>({a.id})</Text>
        </Stack>
      ))}
    </Stack>
  );
}

export default AccountList;
