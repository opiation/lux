import { z as Zod } from "zod";
import { UUID } from "../schema.ts";

export const Account = Zod.object({
  /**
   * A unique identifier for the account
   *
   * This should be treated as an opaque identifier whose only guarantees are
   * that each is unique within its type's set and that it is a non-empty
   * string.
   *
   * @example
   * ```js
   * "f47ac10b-58cc-4372-a567-0e02b2c3d479"
   * ```
   */
  id: Zod.string().trim().uuid(),

  /**
   * Human-meaningful name of the account
   *
   * This does not need to be unique though given the identifying function of
   * names in human communication, it is recommended that they be unique.
   *
   * @example
   * ```js
   * "Personal Checking with Bank X"
   * ```
   */
  name: Zod.string()
    .trim()
    .min(1)
    .describe("Human-meaningful name of the account"),
});
/** @typedef {Zod.infer<typeof Account>} Account */

/**
 * @param {Partial<Account>} [attrs]
 * @returns {Account}
 */
export function account(attrs) {
  return {
    id: UUID.generate(),
    name: "Unknown",
    ...attrs,
  };
}

/**
 * A {@link Transaction} represents a transfer of resources between two
 * accounts.
 */
export const Transaction = Zod.object({
  /** Where were resources transferred to in this transaction? */
  destination: Account.shape.id,
  id: UUID,
  resources: Zod.number().min(0).max(Infinity),
  /** Where were resources transferred from in this transaction? */
  source: Account.shape.id,
});
/** @typedef {Zod.infer<typeof Transaction>} Transaction */
