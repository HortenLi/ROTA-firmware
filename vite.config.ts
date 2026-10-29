import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

let outDir = 'dist'

/**
 * GitHub Pages has no SPA rewrite. Emitting `404.html` as an exact copy of
 * `index.html` makes deep links (and refreshes) on /ROTA-firmware/link work:
 * Pages serves that copy with the original URL, and the client router renders
 * the right page. No redirect round-trip, no hash URLs.
 */
function spaFallback(): Plugin {
  return {
    name: 'rota-spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const dir = resolve(process.cwd(), outDir)
      const index = resolve(dir, 'index.html')
      if (existsSync(index)) copyFileSync(index, resolve(dir, '404.html'))
    },
  }
}

// GitHub Pages project site: https://hortenli.github.io/ROTA-firmware/
export default defineConfig({
  plugins: [react(), spaFallback()],
  base: '/ROTA-firmware/',
  build: {
    target: 'es2019',
  },
})
