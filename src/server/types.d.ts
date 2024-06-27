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
  version: string;
}
