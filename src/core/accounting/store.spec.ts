import { describe, expect, it } from "vitest";
import { Account } from "./schema.js";
import { actions, createStore } from "./store.ts";

describe("Accounting store", () => {
  describe("createAccount", () => {
    it("inserts a new account with the given name and generated unique Id in the `accounts` record", () => {
      const store = createStore({ accounts: {} });
      const initialState = store.getState();

      // We explicitly created the accounting store with an empty `accounts`
      // record but we should also accept `undefined` as a valid initial state
      if (initialState.accounts) {
        expect(Object.keys(initialState.accounts)).toHaveLength(0);
      } else {
        expect(initialState.accounts).toBeUndefined();
      }

      store.dispatch(actions.createAccount({ name: "My grocery budget" }));

      const nextState = store.getState();
      expect(nextState.accounts).not.toBeUndefined();

      const accountIds = Object.keys(nextState.accounts!);
      expect(accountIds).toHaveLength(1);

      const firstAccountId = accountIds.at(0);
      expect(firstAccountId).not.toBeUndefined();

      const firstAccount = nextState.accounts![firstAccountId!];
      expect(() => Account.parse(firstAccount)).not.toThrow();
    });
  });

  describe("deleteAccounts", () => {
    it("does nothing to `accounts` if none of the accounts to be deleted were found", () => {
      const store = createStore({
        accounts: {
          "1": { id: "1", name: "My grocery budget" },
        },
      });
      const initialState = store.getState();
      expect(initialState.accounts!).toHaveProperty("1", {
        id: "1",
        name: "My grocery budget",
      });

      store.dispatch(actions.deleteAccounts("2"));

      const nextState = store.getState();
      expect(nextState).toBe(initialState);
      expect(nextState.accounts).toBe(initialState.accounts);
    });

    it("removes the accounts matching the given account Ids", () => {
      const store = createStore({
        accounts: {
          "1": { id: "1", name: "My grocery budget" },
          "2": { id: "2", name: "My food budget" },
          "4": { id: "4", name: "My savings" },
        },
      });
      const initialState = store.getState();
      const initialAccountIds = Object.keys(initialState.accounts!);

      const givenAccountIds = ["1", "2", "3"];
      store.dispatch(actions.deleteAccounts(givenAccountIds));

      const nextState = store.getState();
      const nextAccountIds = Object.keys(nextState.accounts!);
      expect(nextAccountIds).toEqual(
        initialAccountIds.filter((id) => !givenAccountIds.includes(id)),
      );
    });
  });

  describe("renameAccount", () => {
    it("updates to `newName` the name of the account matching `accountId` when finding it", () => {
      const store = createStore({
        accounts: {
          "1": { id: "1", name: "My grocery budget" },
        },
      });
      const initialState = store.getState();
      expect(initialState.accounts!).toHaveProperty("1", {
        id: "1",
        name: "My grocery budget",
      });

      store.dispatch(
        actions.renameAccount({ accountId: "1", newName: "My food budget" }),
      );

      const nextState = store.getState();
      expect(nextState.accounts).not.toBeUndefined();
      expect(nextState.accounts!["1"]).toEqual({
        id: "1",
        name: "My food budget",
      });
    });

    it("does nothing to the collection of accounts if the account to be renamed is not found", () => {
      const store = createStore({
        accounts: {
          "1": { id: "1", name: "My grocery budget" },
        },
      });
      const initialState = store.getState();
      expect(initialState.accounts!).toHaveProperty("1", {
        id: "1",
        name: "My grocery budget",
      });

      store.dispatch(
        actions.renameAccount({ accountId: "2", newName: "My food budget" }),
      );

      const nextState = store.getState();
      expect(nextState).toBe(initialState);
      expect(nextState.accounts).toBe(initialState.accounts);
    });
  });
});
