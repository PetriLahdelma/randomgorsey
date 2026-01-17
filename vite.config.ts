import path from "path"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",  // Match CRA output for gh-pages compatibility
    sourcemap: true,
  },
  publicDir: "public",
})
