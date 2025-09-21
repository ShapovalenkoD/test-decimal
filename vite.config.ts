import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/decimal/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@decimal", replacement: path.resolve(__dirname, "src") }],
  },
  server: {
    proxy: {
      "/b2api": {
        changeOrigin: true,
        secure: false,
        target: "https://awx.pro",
      },
    },
  },
});
