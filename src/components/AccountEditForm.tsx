import { Button, FormControl, FormLabel, Input, Stack } from "@chakra-ui/react";
import { useCallback, useRef } from "react";
import { Account, account } from "../schema.js";

type AccountEditFormProps = {
  account?: Partial<Account>;
  onSubmit?: (updatedAccount: Account) => void;
};

function AccountEditForm(props: AccountEditFormProps) {
  const defaultAccount = account(props.account);

  const idInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const resetAccount = useCallback(() => {
    if (!idInputRef.current || !nameInputRef.current) return;

    idInputRef.current.value = crypto.randomUUID();
    nameInputRef.current.value = "";
  }, [idInputRef, nameInputRef]);

  const submitAccount = useCallback(() => {
    if (typeof props.onSubmit !== "function") return;
    if (!idInputRef.current || !nameInputRef.current) return;

    props.onSubmit({
      id: idInputRef.current.value,
      name: nameInputRef.current.value,
    });
    resetAccount();
  }, [props.onSubmit, idInputRef, nameInputRef, resetAccount]);

  return (
    <Stack align="center" direction="row" spacing="1rem">
      <FormControl>
        <FormLabel>ID</FormLabel>
        <Input
          defaultValue={defaultAccount.id}
          readOnly
          ref={idInputRef}
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
      <Button onClick={submitAccount} size="lg">
        Submit
      </Button>
    </Stack>
  );
}

export default AccountEditForm;
