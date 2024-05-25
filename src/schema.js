import { z } from "zod";

export const Account = z.object({
    id: z.string().trim().uuid(),
    name: z.string().trim().min(1).describe("Human-meaningful name of the account")
})
/** @typedef {z.infer<typeof Account>} Account */

/**
 * @param {Partial<Account>} [attrs]
 * @returns {Account}
 */
export function account(attrs) {
    return {
        id: crypto.randomUUID(),
        name: "Unknown",
        ...attrs
    }
}
