import process from "node:process";
import * as HTTPServer from "./http-server.js";

async function main() {
  return HTTPServer.create(
    process.env.PORT ? Number.parseInt(process.env.PORT, 10) : undefined
  );
}

main();
