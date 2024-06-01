import Chalk from "chalk";

/** @import { Server as BunServer } from "bun" */
/** @import { IncomingMessage, RequestListener, Server as NodeServer, ServerResponse } from "node:http" */

/**
 * @param {number} [port]
 * @returns {Server}
 */
export function create(port = 3000) {
  /** @type {BunServer | undefined} */
  let bunServer = undefined;

  /** @type {Server} */
  const self = {
    name() {
      return `lux-server`;
    },
    async restart() {
      if (!bunServer) return self.start();

      self.stop();
      await delay(2000);
      self.start();

      return `Restarted Lux server listening at ${Chalk.green.bold(bunServer.url)}`;
    },

    start() {
      if (bunServer) return;

      bunServer = Bun.serve({
        fetch(_request) {
          return new Response(null, { status: 500 });
        },
        port,
      });

      return `Lux server listening at ${Chalk.green.bold(bunServer.url)}`;
    },
    stop() {
      if (!bunServer) return;

      bunServer.stop(true);
      bunServer = undefined;

      return `Stopped Lux server`;
    },
  };

  return self;
}

/**
 * @param {number} [port]
 *   Defaults to `3000`
 * @param {string} [hostname]
 * @returns {Promise<Server>}
 */
export async function forNode(port = 3000, hostname = "localhost") {
  const { createServer } = await import("node:http");

  const url = `http://${hostname}:${port}`;

  /** @type {RequestListener<typeof IncomingMessage, typeof ServerResponse>} */
  function handler(_request, response) {
    response.statusCode = 500;
    response.end();
  }

  /** @type {NodeServer} */
  let nodeServer = createServer(handler);

  /** @type {Server} */
  const self = {
    name() {
      return "lux-node-server";
    },
    async restart() {
      await self.stop();
      await delay(500);
      await self.start();
      return `Listening at ${url}`;
    },
    async start() {
      if (nodeServer.listening) return;

      await new Promise((resolve) =>
        nodeServer.listen(port, hostname, () => {
          resolve(undefined);
        })
      );
      return `Listening at ${url}`;
    },
    async stop() {
      /** @type {Error=} */
      const alreadyClosedError = await new Promise((resolve) =>
        nodeServer.close(resolve)
      );
      if (alreadyClosedError) return;

      return `Stopped Lux server listening at ${url}`;
    },
  };

  return self;
}

/**
 * @param {number} [port]
 * @returns {Server}
 */
export function serve(port = 3000) {
  const server = create(port);
  server.start();
  return server;
}

/**
 *
 * @param {number} [ms]
 * @returns {Promise<void>}
 */
function delay(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @typedef {Object} Server
 * @property {() => string} [name]
 * @property {() => void | Message | Promise<void | Message>} restart
 * @property {() => void | Message | Promise<void | Message>} start
 * @property {() => void | Message | Promise<void | Message>} stop
 */

/** @typedef {string} Message */
