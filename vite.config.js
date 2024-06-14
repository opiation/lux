import { autoInstall } from "vite-plugin-auto-install";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [autoInstall("bun"), react()],
  test: {
    coverage: {
      enabled: true,
    },
  },
});
