import { useRef } from "react";
import { Account } from "../../core/accounting/schema.js";
import { actions } from "../../core/accounting/store.js";
import {
  Button,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

const { deleteAccounts, renameAccount } = actions;

export interface AccountInlineActionsProps {
  account: Account;
  /**
   * If provided, an button to delete the account is rendered and `onDelete` is
   * called with a delete action when the button is clicked. You must dispatch
   * the action yourself to commit the change.
   */
  onDelete?(accountDeletion: ReturnType<typeof deleteAccounts>): void;

  /**
   * If provided, input field and button to rename the account is rendered and
   * `onRename` is called with a rename action when the button is clicked. You
   * must dispatch the action yourself to commit the change.
   */
  onRename?(accountRename: ReturnType<typeof renameAccount>): void;
}

export function AccountInlineActions(props: AccountInlineActionsProps) {
  const { account, onDelete, onRename } = props;

  const deleteConfirmationButton = useRef<HTMLButtonElement | null>(null);
  const newName = useRef<HTMLInputElement | null>(null);

  return (
    <>
      {typeof onRename === "function" && (
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
                    console.warn(
                      `No name input found for account ${account.id}`,
                    );
                    return;
                  }

                  onRename(
                    renameAccount({
                      accountId: account.id,
                      newName: newName.current.value,
                    }),
                  );
                }}
              >
                Rename
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
      {typeof onDelete === "function" && (
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
                onClick={() => onDelete(deleteAccounts(account.id))}
                ref={deleteConfirmationButton}
              >
                Delete
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
