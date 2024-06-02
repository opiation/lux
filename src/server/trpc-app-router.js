import { z } from "zod";
import { publicProcedure, router } from "./trpc.js";

export const appRouter = router({
  version: publicProcedure.output(z.string()).query(() => `1.0.0`),
});

/** @typedef {typeof appRouter} AppRouter */
