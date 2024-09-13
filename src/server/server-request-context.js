/** @import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch" */
/** @import { ServerRequestContext } from "./types.ts" */

import { JSONFileRepository } from "../core/accounting/mod.js";

const accounting = new JSONFileRepository("accounting-database.json");

/**
 * @param {FetchCreateContextFnOptions} _opts
 */
export function fromFetch(_opts) {
  /** @satisfies {ServerRequestContext} */
  const self = Object.freeze({
    accounting,
    version: "local",
  });

  return self;
}
