/** @import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch" */
/** @import { ServerRequestContext } from "./types.d.ts" */

/**
 * @param {FetchCreateContextFnOptions} _opts
 */
export function fromFetch(_opts) {
  /** @satisfies {ServerRequestContext} */
  const self = Object.freeze({
    version: "local",
  });

  return self;
}
