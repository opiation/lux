import {
  Button,
  Flex,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
} from "@chakra-ui/react";
import { bindActionCreators } from "@reduxjs/toolkit";
import { Account } from "../../core/accounting/schema.js";
import {
  actions,
  useDispatch,
  useSelector,
} from "../../core/accounting/store.ts";
import { useMemo, useRef } from "react";

type AccountListProps = {
  accounts?: Array<Account>;
  onDelete?(accountDeletion: unknown): void;
  onRename?(accountRename: unknown): void;
};

function AccountList(props: AccountListProps) {
  const accountMap = useSelector((accounting) => accounting.accounts);
  const accounts = accountMap ? Object.values(accountMap) : undefined;

  const accountsToDisplay = useMemo(
    () => props.accounts ?? accounts ?? [],
    [props.accounts, accounts],
  );

  return (
    <Stack direction="column">
      {accountsToDisplay.map((a) => (
        <Flex direction="row" gap={2} key={a.id}>
          <Text flexGrow={1}>{a.name}</Text>
          <Text flexGrow={1}>({a.id})</Text>
          <AccountInlineActions account={a} />
        </Flex>
      ))}
    </Stack>
  );
}

function AccountInlineActions(props: { account: Account }) {
  const { account } = props;

  const dispatch = useDispatch();
  const { deleteAccounts, renameAccount } = useMemo(
    () => bindActionCreators(actions, dispatch),
    [dispatch],
  );

  const deleteConfirmationButton = useRef<HTMLButtonElement | null>(null);
  const newName = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <Popover key="rename-action">
        <PopoverTrigger>
          <Button>Rename...</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody display="flex" flexDir="row" gap={3}>
            <Input
              defaultValue={account.name}
              placeholder="New name"
              ref={newName}
              type="text"
            />
            <Button
              onClick={() => {
                if (!newName.current) {
                  console.warn(`No name input found for account ${account.id}`);
                  return;
                }

                renameAccount({
                  accountId: account.id,
                  newName: newName.current.value,
                });
              }}
            >
              Rename
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Popover initialFocusRef={deleteConfirmationButton} key="delete-action">
        <PopoverTrigger>
          <Button colorScheme="red" variant="outline">
            Delete...
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <Text>
              Are you sure you want to delete the account "{account.name}" (id{" "}
              {account.id})?
            </Text>
            <Button
              onClick={() => deleteAccounts(account.id)}
              ref={deleteConfirmationButton}
            >
              Delete
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

export default AccountList;
