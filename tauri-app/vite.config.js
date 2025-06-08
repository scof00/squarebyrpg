import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ["tauri"], // ✅ Critical for Vite + Tauri compatibility
  },
  optimizeDeps: {
    exclude: ["@tauri-apps/api"],
  },
  server: {
    port: 3000, // 👈 change this line to set your port
    host: "localhost", // 👈 optional, defaults to localhost anyway
  },
});
