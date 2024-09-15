import { Button } from "@chakra-ui/react";
import { lazy, useEffect, useMemo, useState } from "react";
import { Provider } from "react-redux";
import { Routes, Route, useParams } from "react-router-dom";
import * as accounting from "../../core/accounting/store.ts";
import { bindActionCreators } from "@reduxjs/toolkit";

const AccountListPage = lazy(() => import("./AccountList.tsx"));
const AccountEditor = lazy(() => import("./AccountEditPage.tsx"));
function AccountEditorPage() {
  const { id } = useParams();

  return <AccountEditor existingAccountId={id} />;
}

const accountingStore = accounting.createStore();
const { dispatch } = accountingStore;

export function Accounting() {
  const [sessionId] = useState(() => "accounting-store");
  const { createAccount, load } = useMemo(
    () => bindActionCreators(accounting.actions, dispatch),
    [],
  );

  // Load any existing accounting state from local storage if it exists
  useEffect(() => {
    const storage = globalThis.localStorage;

    let serializedAccountingStoreState = storage.getItem(sessionId);
    if (!serializedAccountingStoreState) return;

    serializedAccountingStoreState = serializedAccountingStoreState.trim();
    if (serializedAccountingStoreState.length === 0) return;

    const accountingStoreStateInStorage = JSON.parse(
      serializedAccountingStoreState,
    );
    const accountingInStorage = accounting.State.safeParse(
      accountingStoreStateInStorage,
    );
    if (accountingInStorage.error) {
      console.warn(accountingInStorage.error);
    }
    if (!accountingInStorage.success || !accountingInStorage.data) return;

    load(accountingInStorage.data);
  }, [load, sessionId]);

  useEffect(() => {
    const unsubscribe = accountingStore.subscribe(() => {
      const accountingState = accountingStore.getState();
      const serializedAccountingState = JSON.stringify(accountingState);
      const storage = globalThis.localStorage;
      try {
        storage.setItem(sessionId, serializedAccountingState);
      } catch (error: unknown) {
        if (!(error instanceof DOMException)) {
          console.error(
            `Unknown error saving accounting session ${sessionId} state to local storage: `,
            error,
          );
          return;
        }

        switch (error.name) {
          case "QuotaExceededError":
            console.error(
              `Local storage quota exceeded while saving accounting session ${sessionId} state`,
            );
            break;
          default:
            console.error(
              `Unhandled DOMException ${error.name} saving accounting session ${sessionId} state to local storage: `,
              error,
            );
            break;
        }
      }
    });

    return unsubscribe;
  }, [sessionId]);

  return (
    <Provider context={accounting.Context} store={accountingStore}>
      <Button
        onClick={() => dispatch(createAccount({ name: crypto.randomUUID() }))}
      >
        Create a random account
      </Button>
      <Routes>
        <Route element={<AccountListPage />} index />
        <Route path="edit/:id" element={<AccountEditorPage />} />
      </Routes>
    </Provider>
  );
}

export default Accounting;
