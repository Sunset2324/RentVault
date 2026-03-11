import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// Source - https://stackoverflow.com/a/69261966
// Posted by Haseeb Saeed, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-12, License - CC BY-SA 4.0

// https://vitejs.dev/config/
export default defineConfig({
  base: "/Stakepool-Frontend/",
  plugins: [vue()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "node_modules"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
