import { useState } from "react";
import { Account } from "../schema.js";
import { default as AccountEditForm } from "./AccountEditForm.tsx";
import { default as AccountList } from "./AccountList.tsx";

export function Accounting() {
  const [accounts, setAccounts] = useState((): Array<Account> => []);

  return (
    <>
      <AccountEditForm
        onSubmit={(newAccount) =>
          setAccounts((current) => [...current, newAccount])
        }
      />
      <AccountList accounts={accounts} />
    </>
  );
}

export { AccountEditForm, AccountList };
