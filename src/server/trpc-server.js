import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { fromFetch } from "./server-request-context.js";
import { appRouter } from "./trpc-app-router.js";

/**
 *
 * @param {string} [endpoint]
 * @returns
 */
export function trpcServer(endpoint = "/trpc") {
  return {
    /**
     * @param {Request} request
     * @returns {Promise<Response>}
     */
    async fetch(request) {
      return fetchRequestHandler({
        createContext: fromFetch,
        endpoint,
        req: request,
        router: appRouter,
      });
    },
  };
}
