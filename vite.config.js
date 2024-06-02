import { defineConfig } from "vite";
import { autoInstall } from "vite-plugin-auto-install";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [autoInstall("bun"), react()],
});
