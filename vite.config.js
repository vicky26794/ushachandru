import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { renameSync, existsSync } from "node:fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "rename-app-html",
      closeBundle() {
        const from = resolve(__dirname, "dist/app.html");
        const to = resolve(__dirname, "dist/index.html");
        if (existsSync(from)) renameSync(from, to);
      },
    },
  ],
  // Relative paths work on GitHub Pages under /ushachandru/ and /ushachandru/docs/
  base: "./",
  build: {
    rollupOptions: {
      input: resolve(__dirname, "app.html"),
    },
  },
  server: {
    open: "/app.html",
  },
  preview: {
    open: "/app.html",
  },
});
