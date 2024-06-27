import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./server/trpc-app-router.js";

export const trpc = createTRPCReact<AppRouter>();
