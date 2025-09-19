import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
    {
      name: 'rename-output',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        const oldPath = path.join(distDir, 'index.html');
        const newPath = path.join(distDir, 'doodlewallet-standalone.html');
        if (fs.existsSync(oldPath)) {
          fs.renameSync(oldPath, newPath);
        }
      }
    }
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
