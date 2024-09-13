// @ts-check

import Chalk from "chalk";
import { z as Zod } from "zod";
import { ErrorType, err, ok, result } from "../schema/result.js";
import { Transaction } from "./schema.js";

/** @import { Awaitable } from "../../server/types.d.ts" */
/** @import { Account } from "./schema.js" */

/**
 * The result type returned by a {@link Repository} when a sequence of
 * transactions have been committed. The success value is the list of
 * transactions that were added.
 *
 * @note Though exported, it's unlikely you'll need to use this type directly in
 *       application code but rather as the type returned by methods from
 *       {@link Repository} implementations.
 */
export const TransactResult = result(Zod.array(Transaction), ErrorType);
/** @typedef {Zod.infer<typeof TransactResult>} TransactResult */

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

/** @implements {Repository} */
export class InMemoryRepository {
  /** @type {Map<Account["id"], Account>} */
  #accounts = new Map();

  /** @type {Map<Transaction["id"], Transaction>} */
  #transactions = new Map();

  /**
   * Create a new in-memory repository for managing accounts and transactions.
   *
   * @param {Map<Account["id"], Account>} [accounts]
   * @param {Map<Transaction["id"], Transaction>} [transactions]
   */
  constructor(accounts, transactions) {
    this.#accounts = new Map(accounts);
    this.#transactions = new Map(transactions);
  }

  /**
   * List all the accounts in the repository.
   *
   * @returns {Array<Account>}
   */
  accounts() {
    return Array.from(this.#accounts.values());
  }

  /**
   * Remove an account matching the given `accountId` from the repository if it
   * exists.
   *
   * @param {Account["id"]} accountId
   * @returns {Account["id"]}
   */
  removeAccount(accountId) {
    this.#accounts.delete(accountId);
    console.log(`Removed account ${Chalk.bold.blue(accountId)}.`);
    return accountId;
  }

  /**
   * Set the given `newAccount` into the repository with its `id` for lookup.
   *
   * @param {Account} newAccount
   * @returns {Account}
   */
  setAccount(newAccount) {
    this.#accounts.set(newAccount.id, newAccount);
    console.log(`Saved account ${Chalk.bold.blue(newAccount.id)}.`);
    return newAccount;
  }

  /**
   * Commit the given `newTransactiona` to the repository in the given order.
   *
   * @param {Array<Transaction>} newTransactions
   * @returns {TransactResult}
   */
  transact(...newTransactions) {
    for (const t of newTransactions) {
      // TODO: Validate that the transaction is possible before committing it.
      this.#transactions.set(t.id, t);
    }

    return ok(newTransactions);
  }

  /**
   * List all the transactions in the repository.
   *
   * @returns {Array<Transaction>}
   */
  transactions() {
    return Array.from(this.#transactions.values());
  }
}

/** @implements {Repository} */
export class JSONFileRepository {
  /** @type {string} */
  #filePath;

  /** @returns {Promise<{ accounts: Record<Account["id"], Account>, transactions: Record<Transaction["id"], Transaction> }>} */
  async #read() {
    return Bun.file(this.#filePath, { type: "application/json" }).json();
  }

  /**
   * @param {{ accounts: Record<Account["id"], Account>, transactions: Record<Transaction["id"], Transaction> }} data
   * @returns {Promise<void>}
   */
  async #write(data) {
    await Bun.write(this.#filePath, JSON.stringify(data, null, 2));
    return;
  }

  /** @param {string} usingFilePath */
  constructor(usingFilePath) {
    this.#filePath = usingFilePath;
  }

  /**
   * @returns {Promise<Array<Account>>}
   */
  async accounts() {
    console.log(`Reading account from ${Chalk.bold.blue(this.#filePath)}.`);
    const { accounts } = await this.#read();
    return Object.values(accounts);
  }

  /**
   * @param {ReadonlyArray<Transaction>} transactionsToCommit
   * @returns {Promise<TransactResult>}
   */
  async transact(...transactionsToCommit) {
    const { accounts, transactions: existingTransactions } = await this.#read();
    /** @type {Array<Transaction>} */
    let committedTransactions = [];

    for (const newTransaction of transactionsToCommit) {
      /** @type {Transaction | undefined} */
      const existingTransaction = existingTransactions[newTransaction.id];
      if (!existingTransaction) {
        const uncommittedTransactionIds = transactionsToCommit.map((t) => t.id);
        return err({
          message: `Unable to commit transactions ${uncommittedTransactionIds.join(", ")}. Transaction with id ${newTransaction.id} already exists.`,
        });
      }

      existingTransactions[newTransaction.id] = newTransaction;
      committedTransactions.push(newTransaction);
    }

    this.#write({ accounts, transactions: existingTransactions });
    return ok(committedTransactions);
  }

  /**
   * Remove account matching `accountId` from the repository stored in the
   * configured JSON file. If the account is found, it is removed and the
   * configured JSON file is written. Otherwise, the JSON file is not modified.
   *
   * @param {Account["id"]} accountId
   * @returns {Promise<Account["id"]>}
   */
  async removeAccount(accountId) {
    const { accounts, transactions } = await this.#read();

    if (!accounts[accountId]) {
      return accountId;
    }

    delete accounts[accountId];
    await this.#write({ accounts, transactions });
    return accountId;
  }

  /**
   * Insert the given `newAccount` into the repository stored in the configured
   * JSON file. If the account is already present, the configured JSON file is
   * not modified.
   *
   * @param {Account} newAccount
   * @returns {Promise<Account>}
   */
  async setAccount(newAccount) {
    const { accounts, transactions } = await this.#read();

    const existingAccount = accounts[newAccount.id];
    if (!existingAccount) {
      accounts[newAccount.id] = newAccount;
      await this.#write({ accounts, transactions });
    }

    return newAccount;
  }

  /**
   *
   * @returns {Promise<Array<Transaction>>}
   */
  async transactions() {
    const { transactions } = await this.#read();
    return Object.values(transactions);
  }
}

export const Repository = {
  /**
   * Export `aRepo` to a {@link File}.
   *
   * @param {Repository} aRepo
   * @returns {Promise<File>}
   */
  async toFile(aRepo) {
    const exportableJSON = await Repository.toJSON(aRepo);

    return new File(
      [JSON.stringify(exportableJSON, null, 2)],
      "accounting.json",
      { type: "application/json" },
    );
  },

  /**
   * Export `aRepo` to a plain JSON object.
   *
   * @param {Repository} aRepo
   * @returns {Promise<{accounts: Array<Account>, transactions: Array<Transaction>}>}
   */
  async toJSON(aRepo) {
    return {
      accounts: await aRepo.accounts(),
      transactions: await aRepo.transactions(),
    };
  },
};
