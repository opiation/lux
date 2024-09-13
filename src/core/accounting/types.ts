import type { Awaitable } from "../../server/types.ts";
import type { ErrorType, Result } from "../schema/result.js";
import type { Account, Transaction } from "./schema.js";

/**
 * @typedef Repository
 *   A {@link Repository} is a data store for managing {@link Account}s and
 * {@link Transaction}s. To support diverse implementations, all methods
 * accessing records from its backing store are asynchronous. Note however that
 * implementations may return synchronously.
 *
 * @property {() => Awaitable<Array<Account>>} accounts
 * List all the accounts in the repository
 *
 * @property {(...txns: Array<Transaction>) => Awaitable<TransactResult>} transact
 * Add one or more transactions `txns` into the repository, applied in the
 * order they are received.
 *
 * @property {(id: Account["id"]) => Awaitable<Account["id"]>} removeAccount
 * Remove the account matching the given `id` from the repository if it exists.
 *
 * @property {(a: Account) => Awaitable<Account>} setAccount
 * Set the given `account` into the repository with its `id` for lookup.
 *
 * @property {() => Awaitable<Array<Transaction>>} transactions
 * List all the transactions in the repository
 */

/**
 * A {@link Repository} is a data store for managing {@link Account}s and
 * {@link Transaction}s. To support diverse implementations, all methods
 * accessing records from its backing store are asynchronous. Note however that
 * implementations may return synchronously.
 */
export interface Repository {
  /** List all the accounts in the repository */
  accounts(): Awaitable<Array<Account>>;

  /**
   * Commit the `transactionsToCommit` into the repository, applied in the order
   * they are received.
   */
  transact(
    ...transactionsToCommit: ReadonlyArray<Transaction>
  ): Awaitable<Result<Array<Transaction>, ErrorType>>;

  /**
   * Remove the account matching the given `id` from the repository if it
   * exists.
   */
  removeAccount(id: Account["id"]): Awaitable<Account["id"]>;

  /** Set the given `account` into the repository with its `id` for lookup. */
  setAccount(account: Account): Awaitable<Account>;

  /** List all the transactions in the repository */
  transactions(): Awaitable<Array<Transaction>>;
}
