import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
  ],
  root: "src",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3745,
    host: true,
    open: true,
  },
  build: {
    outDir: "../dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
