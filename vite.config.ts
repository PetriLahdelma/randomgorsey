import fs from "fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"
import { defineConfig, type Plugin, type ViteDevServer } from "vite"

const DEV_BANNER_START = "<!-- dev-banner-start -->"
const DEV_BANNER_END = "<!-- dev-banner-end -->"

const loadDevBanner = (): string => {
  try {
    const bannerPath = path.resolve(__dirname, "banner.md")
    const source = fs.readFileSync(bannerPath, "utf8")
    const startIndex = source.indexOf(DEV_BANNER_START)
    const endIndex = source.indexOf(DEV_BANNER_END)

    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      return source.trim()
    }

    const raw = source.slice(startIndex + DEV_BANNER_START.length, endIndex)
    return raw.replace(/^\r?\n+/, "").replace(/\r?\n+$/, "")
  } catch {
    return ""
  }
}

const frameBanner = (banner: string): string => {
  const lines = banner.split(/\r?\n/)
  const width = lines.reduce((max, line) => Math.max(max, line.length), 0)
  if (width === 0) return ""
  const border = "$".repeat(width)
  return [border, ...lines, border].join("\n")
}

const colorizeBanner = (banner: string): string => {
  const useColor = process.stdout.isTTY
  if (!useColor) return banner

  const palette = [
    [255, 214, 0],
    [255, 120, 0],
    [255, 64, 129],
    [0, 219, 222],
    [57, 255, 20],
    [0, 153, 255],
  ]

  return banner
    .split(/\r?\n/)
    .map((line, index) => {
      if (!line) return ""
      const [r, g, b] = palette[index % palette.length]
      return `\x1b[1m\x1b[38;2;${r};${g};${b}m${line}\x1b[0m`
    })
    .join("\n")
}

const devBannerPlugin = (): Plugin => ({
  name: "random-gorsey-dev-banner",
  apply: "serve",
  configureServer(server: ViteDevServer) {
    const banner = loadDevBanner()
    if (!banner) return
    const output = colorizeBanner(frameBanner(banner))
    const logBanner = () => {
      console.log(`\n${output}\n`)
    }

    if (server.httpServer) {
      server.httpServer.once("listening", logBanner)
    } else {
      logBanner()
    }
  },
})

export default defineConfig({
  plugins: [
    devBannerPlugin(),
    react(),
    tailwindcss(),
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
