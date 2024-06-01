import { defineConfig } from "vite";
import Path from "node:path";
import { checker } from "vite-plugin-checker";
import react from "@vitejs/plugin-react-swc";
import { autoInstall } from "./dev-tools/vite-plugin-auto-install.js";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // checker({
    //   eslint: { lintCommand: "" },
    //   typescript: true,
    // }),
    autoInstall("bun"),
    react(),
  ],
});
