import { v4 } from "uuid";
import { z } from "zod";

/**
 * Generate a UUIDv4 using `globalThis.crypto` or falling back to the `uuid`
 * library
 *
 * @returns {string}
 */
export function uuid() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  } else {
    return v4();
  }
}

export const Account = z.object({
  id: z.string().trim().uuid(),
  name: z
    .string()
    .trim()
    .min(1)
    .describe("Human-meaningful name of the account"),
});
/** @typedef {z.infer<typeof Account>} Account */

/**
 * @param {Partial<Account>} [attrs]
 * @returns {Account}
 */
export function account(attrs) {
  return {
    id: uuid(),
    name: "Unknown",
    ...attrs,
  };
}
