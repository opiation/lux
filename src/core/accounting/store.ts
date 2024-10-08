import {
  configureStore,
  createSlice,
  type PayloadAction,
  type StoreEnhancer,
  type ThunkDispatch,
  type Tuple,
} from "@reduxjs/toolkit";
import { createContext } from "react";
import { z as Zod } from "zod";
import {
  createDispatchHook,
  createSelectorHook,
  createStoreHook,
  type ReactReduxContextValue,
  type TypedUseSelectorHook,
} from "react-redux";
import { Account } from "./schema.js";

export const State = Zod.object({
  accounts: Zod.record(Account.shape.id, Account).nullish(),

  /**
   * A unique identifier used to refer this accounting session
   */
  sessionId: Zod.string(),
});
export interface State extends Zod.infer<typeof State> {}

// export interface State {
//   accounts?: Record<Account["id"], Account>;
//   /**
//    * A unique identifier used to refer this accounting session
//    */
//   sessionId: string;
// }

function defaultState() {
  return {
    accounts: {},
    sessionId: crypto.randomUUID(),
  } satisfies State;
}

function initializeState(attrs?: Partial<State>): State {
  return {
    ...defaultState(),
    ...attrs,
  };
}

const slice = createSlice({
  initialState: initializeState,
  name: "Accounting",
  reducers: {
    createAccount(
      state,
      {
        payload: initialAccountAttrs,
      }: PayloadAction<{ name: Account["name"] }>,
    ) {
      const newAccount = Account.parse({
        ...initialAccountAttrs,
        id: crypto.randomUUID(),
      });

      if (state.accounts) {
        state.accounts[newAccount.id] = newAccount;
      } else {
        state.accounts = { [newAccount.id]: newAccount };
      }
    },
    deleteAccounts(
      state,
      {
        payload: accountIds,
      }: PayloadAction<Account["id"] | ReadonlyArray<Account["id"]>>,
    ) {
      // If we have no accounts, then the action may be considered already
      // fulfilled as its goal is for a set of accounts to not be in this state.
      if (!state.accounts) return state;

      // Coerce the Account Id input into an array to use a single
      // implementation.
      accountIds = Array.isArray(accountIds) ? accountIds : [accountIds];

      for (const accountId of accountIds) {
        if (state.accounts[accountId]) {
          delete state.accounts[accountId];
        }
      }
    },
    load(_, { payload: loadedState }: PayloadAction<State>) {
      return loadedState;
    },
    renameAccount(
      state,
      action: PayloadAction<{
        accountId: Account["id"];
        newName: Account["name"];
      }>,
    ) {
      const { accountId, newName } = action.payload;

      if (
        !state.accounts?.[accountId] ||
        state.accounts[accountId].name === newName
      )
        return state;

      state.accounts[accountId].name = newName;
    },
  },
  selectors: {
    accountById(state, accountId: Account["id"]): Account | undefined {
      return state.accounts?.[accountId];
    },
  },
});

export const { actions, reducer, selectors } = slice;

export type Action = ReturnType<(typeof actions)[keyof typeof actions]>;
type Enhancers = Tuple<
  [
    StoreEnhancer<{
      dispatch: ThunkDispatch<State, undefined, Action>;
    }>,
  ]
>;

export function createStore(initialState?: Partial<State>) {
  return configureStore<State, Action, any, Enhancers>({
    devTools: { name: "Accounting" },
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers() as Enhancers,
    preloadedState: initializeState(initialState),
    reducer: slice.reducer,
  });
}

export const Context = createContext<ReactReduxContextValue<
  State,
  Action
> | null>(null);
export const useDispatch = createDispatchHook(Context);
export const useSelector: TypedUseSelectorHook<State> =
  createSelectorHook(Context);
export const useStore = createStoreHook(Context);

export default slice;
