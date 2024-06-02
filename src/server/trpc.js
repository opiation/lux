import { initTRPC } from "@trpc/server";

/** @import { TRPCBuilder } from "../../node_modules/@trpc/server/dist/unstable-core-do-not-import/initTRPC.ts" */
/** @import { ServerContext } from "./types.d.ts" */

/** @type {TRPCBuilder<ServerContext, object>} */
const contextualizedBuilder = initTRPC.context();
export const t = contextualizedBuilder.create();

export const publicProcedure = t.procedure;
export const router = t.router;
