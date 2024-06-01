import Chalk from "chalk";
import Path from "node:path";
import { defineConfig } from "vite";
import { checker } from "vite-plugin-checker";
import react from "@vitejs/plugin-react-swc";
import { autoInstall } from "./dev-tools/vite-plugin-auto-install.js";
import * as LuxServer from "./src/server/http-server.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // checker({
    //   eslint: { lintCommand: "" },
    //   typescript: true,
    // }),
    autoInstall("bun"),
    {
      async configureServer(server) {
        const { logger } = server.config;

        const luxServer = await LuxServer.forNode();

        server.httpServer?.on("listening", async () => {
          const message = await luxServer.restart();
          setTimeout(() => {
            const name = luxServer.name?.();
            const prefix =
              name && name.trim().length > 0
                ? `${Chalk.blue.bold(name.trim())} `
                : "";
            logger.info(`  ${Chalk.grey("➜")}  ${prefix}${message}`);
          }, 20);
        });
      },
      name: "vite-plugin-http-server",
    },
    react(),
  ],
});
