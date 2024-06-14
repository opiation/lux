import { z } from "zod";
import { UUID } from "./core/schema/uuid.js";

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
    id: UUID.generate(),
    name: "Unknown",
    ...attrs,
  };
}
