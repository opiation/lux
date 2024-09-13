import type { Repository } from "../core/accounting/mod.js";

/**
 * A value that can be _awaited_ (e.g.: with the `await` keyword).
 *
 * One example use case is when defining interfaces, returning {@link Awaitable}
 * values from methods allows the implementor to return either a value or a
 * promise of a value.
 *
 * @example
 * ```ts
 * interface Store {
 *   get(key: string): Awaitable<string | undefined>;
 *   set(key: string, value: string): Awaitable<void>;
 * }
 *
 * class InMemoryStore implements Store {
 *   private store = new Map<string, string>();
 *
 *   get(key: string): string | undefined {
 *     return this.store.get(key) ?? undefined;
 *   }
 *
 *   set(key: string, value: string): void {
 *     this.store.set(key, value);
 *   }
 * }
 * ```
 */
export type Awaitable<T> = T | Promise<T>;

export interface AsyncStore<Value = unknown> {
  get(key: string): Promise<Value>;
  set(key: string, value: Value): Promise<void>;
}

/**
 * The {@link ServerRequestContext} is the _context_ a server needs in order to
 * handle incoming reqests.
 */
export interface ServerRequestContext {
  accounting: Repository;
  version: string;
}
