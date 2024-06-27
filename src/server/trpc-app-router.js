import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";
import { usingOllama } from "../core/meal-planner.ts";

export const appRouter = router({
  config: publicProcedure
    .output(z.object({ version: z.string() }))
    .query(async ({ ctx }) => {
      return {
        version: ctx.version,
      };
    }),

  generateMealPlans: publicProcedure
    .output(z.string())
    .input(
      z.object({
        adultCount: z.number().min(0).optional().default(2),
        childCount: z.number().min(0).optional().default(2),
        mealCount: z.number().min(1).optional().default(7),
      })
    )
    .mutation(async ({ input }) => usingOllama().generateMealPlans(input)),

  version: publicProcedure.output(z.string()).query(({ ctx }) => ctx.version),
});

/** @typedef {typeof appRouter} AppRouter */
