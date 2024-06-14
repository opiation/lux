export type Awaitable<T> = T | Promise<T>;

export interface AsyncStore<Value = unknown> {
  get(key: string): Promise<Value>;
  set(key: string, value: Value): Promise<void>;
}

export interface ServerRequestContext {
  version: string;
}
