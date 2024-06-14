import { Application, Router, serve } from "@oakserver/oak";
import Chalk from "chalk";
import { trpcServer } from "./trpc-server";

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
      `${Chalk.grey.dim(`[${now}]`)} ${Chalk.bold(ctx.request.method)} ${ctx.request.url.pathname}`
    );
    await next();
  });

  const trpcFetchHandler = trpcServer().fetch;
  luxHTTPServer.use(
    serve((request, _ctx) => {
      return /** @type {any} */ (
        trpcFetchHandler(/** @type {any} */ (request))
      );
    })
  );

  luxHTTPServer.use(root.routes());
  luxHTTPServer.use(root.allowedMethods());

  luxHTTPServer.addEventListener("listen", (serverListening) => {
    const serverURL = `${serverListening.secure ? "https" : "http"}://${serverListening.hostname}:${serverListening.port}`;
    const now = new Date().toLocaleTimeString();

    console.info(
      `${Chalk.grey.dim(`[${now}]`)} Server listening at ${Chalk.green.bold(serverURL)} 🚀`
    );
  });

  luxHTTPServer.listen({ port });
}
