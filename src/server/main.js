import * as HTTPServer from "./http-server.js";

async function main() {
  if (globalThis.Bun) {
    const lux = HTTPServer.create();
    lux.start();
  } else {
    const lux = await HTTPServer.forNode();
    lux.start();
  }
}

main();
