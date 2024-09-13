import { Button, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { Account, account } from "../../core/accounting/schema.js";
import { UUID } from "../../core/schema.js";

type AccountEditFormProps = {
  account?: Partial<Account>;
  onSubmit?: (updatedAccount: Account) => void;
};

function AccountEditForm(props: AccountEditFormProps) {
  const { onSubmit } = props;

  const defaultAccount = account(props.account);

  const idInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const resetAccount = useCallback(() => {
    if (!idInputRef.current || !nameInputRef.current) return;

    idInputRef.current.value = UUID.generate();
    nameInputRef.current.value = "";
  }, [idInputRef, nameInputRef]);

  const submitAccount = useCallback(() => {
    if (typeof onSubmit !== "function") return;
    if (!idInputRef.current || !nameInputRef.current) return;

    onSubmit({
      id: idInputRef.current.value,
      name: nameInputRef.current.value,
    });
    resetAccount();
  }, [onSubmit, idInputRef, nameInputRef, resetAccount]);

  return (
    <Stack align="center" direction="row" spacing="1rem">
      <FormControl>
        <FormLabel>ID</FormLabel>
        <Input
          defaultValue={defaultAccount.id}
          minWidth="23rem"
          readOnly
          ref={idInputRef}
          textAlign="center"
          type="text"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          defaultValue={defaultAccount.name}
          placeholder="Unknown"
          ref={nameInputRef}
          type="text"
        />
      </FormControl>
      <Button onClick={submitAccount} size="">
        Submit
      </Button>
    </Stack>
  );
}

export default AccountEditForm;
