import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";

export const appRouter = router({
  config: publicProcedure
    .output(z.object({ version: z.string() }))
    .query(async ({ ctx }) => {
      return {
        version: ctx.version,
      };
    }),

  version: publicProcedure.output(z.string()).query(({ ctx }) => ctx.version),
});

/** @typedef {typeof appRouter} AppRouter */
