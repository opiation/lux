import { Application, Router, serve } from "@oakserver/oak";
import Chalk from "chalk";
import { trpcServer } from "./trpc-server.js";

/// <reference types="bun-types" />

/**
 * @param {number} [port]
 */
export function create(port = 3000) {
  const luxHTTPServer = new Application();

  const root = new Router();

  root.get("/", (ctx) => {
    ctx.response.body = { routes: "Hello, world!" };
  });

  luxHTTPServer.use(async (ctx, next) => {
    const now = new Date().toLocaleTimeString();

    console.log(
      `${Chalk.grey(`[${now}]`)} ${Chalk.bold(ctx.request.method)} ${ctx.request.url.pathname}`
    );
    await next();
  });

  const trpcFetchHandler = trpcServer().fetch;
  luxHTTPServer.use(
    serve(async (request, _ctx) => {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Headers": "content-type",
            "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
          },
        });
      }

      const trpcResponse = await /** @type {Promise<Response>} */ (
        trpcFetchHandler(/** @type {any} */ (request))
      );

      trpcResponse.headers.set("Access-Control-Allow-Origin", "*");

      return /** @type {any} */ (trpcResponse);
    })
  );

  luxHTTPServer.use(root.routes());
  luxHTTPServer.use(root.allowedMethods());

  luxHTTPServer.addEventListener("listen", (serverListening) => {
    const serverURL = `${serverListening.secure ? "https" : "http"}://${serverListening.hostname}:${serverListening.port}`;
    const now = new Date().toLocaleTimeString();

    console.info(
      `${Chalk.grey(`[${now}]`)} Server listening at ${Chalk.green.bold(serverURL)} 🚀`
    );
  });

  luxHTTPServer.listen({ port });
}
