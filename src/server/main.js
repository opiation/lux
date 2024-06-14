import { Application, Router } from "@oakserver/oak";
import process from "node:process";

async function main() {
  const luxHTTPServer = new Application();

  const root = new Router();

  root.get("/", (ctx) => {
    ctx.response.body = { message: "Hello, world!" };
  });

  luxHTTPServer.use(root.allowedMethods());
  luxHTTPServer.use(root.routes());

  luxHTTPServer.addEventListener("listen", (serverListening) => {
    const serverURL = `${serverListening.secure ? "https" : "http"}://${serverListening.hostname}:${serverListening.port}`;

    console.info(`Server listening at ${serverURL} 🚀`);
  });

  luxHTTPServer.listen({
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : undefined,
  });

  // if (globalThis.Bun) {
  //   const lux = HTTPServer.create();
  //   lux.start();
  // } else {
  //   const lux = await HTTPServer.forNode();
  //   lux.start();
  // }
}

main();
