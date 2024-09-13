import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";
import { MealPlan, usingOllama } from "../core/meal-planner.js";
import { UUID, User } from "../core/schema.js";
import { Account } from "../schema.js";

export const appRouter = router({
  accounting: router({
    account: publicProcedure
      .output(z.optional(Account))
      .input(Account.shape.id)
      .query(async ({ ctx: { accounting }, input }) => {
        const accounts = await accounting.accounts();
        return accounts.find((account) => account.id === input);
      }),

    /**
     * Get an array of all accounts
     */
    accounts: publicProcedure
      .output(z.array(Account))
      .query(async ({ ctx: { accounting } }) => {
        return accounting.accounts();
      }),

    createAccount: publicProcedure
      .output(Account)
      .input(
        z.object({
          /**
           * Human-meaningful name of the new account to create
           */
          name: Account.shape.name,
        }),
      )
      .mutation(async ({ ctx: { accounting }, input }) => {
        const newAccount = Account.parse({
          id: UUID.generate(),
          name: input.name,
        });
        return accounting.setAccount(newAccount);
      }),

    deleteAccount: publicProcedure
      .output(Account.shape.id)
      .input(Account.shape.id)
      .mutation(async ({ ctx: { accounting }, input }) => {
        return accounting.removeAccount(input);
      }),
  }),

  config: publicProcedure
    .output(z.object({ version: z.string() }))
    .query(async ({ ctx }) => {
      return {
        version: ctx.version,
      };
    }),

  generateMealPlans: publicProcedure
    .output(MealPlan)
    .input(
      z.object({
        adultCount: z.number().min(0).optional().default(2),
        childCount: z.number().min(0).optional().default(2),
        mealCount: z.number().min(1).optional().default(7),
      }),
    )
    .mutation(async ({ input }) => usingOllama().generateMealPlans(input)),

  user: router({
    create: publicProcedure.output(User).mutation(async (_ctx) => {
      return User.parse({});
    }),
  }),

  version: publicProcedure.output(z.string()).query(({ ctx }) => ctx.version),
});

/** @typedef {typeof appRouter} AppRouter */
