/** @import { Awaitable, ServerRequestContext } from "./types.d.ts" */

/**
 * @param {import("@trpc/server/adapters/fetch").FetchCreateContextFnOptions} _opts
 * @returns {ServerRequestContext}
 */
export function fromFetch(_opts) {
  /** @type {ServerRequestContext} */
  const self = {
    version: "local",
  };

  return self;
}
