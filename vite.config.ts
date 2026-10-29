import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

let outDir = 'dist'

/**
 * GitHub Pages has no SPA rewrite, so both routes need a real HTML file:
 *
 *  - `link/index.html` — same shell, so /ROTA-firmware/link/ answers **200**
 *    (a 404.html fallback would render fine but would answer 404, which search
 *    engines read as "this page does not exist").
 *  - `404.html` — a byte copy of the shell, so any other deep link or a stray
 *    refresh still boots the app instead of showing GitHub's 404 page.
 *
 * The client router reads `location.pathname`, so both files render the right
 * page with the URL left exactly as the visitor typed it.
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
      if (!existsSync(index)) return
      copyFileSync(index, resolve(dir, '404.html'))
      const linkDir = resolve(dir, 'link')
      mkdirSync(linkDir, { recursive: true })
      copyFileSync(index, resolve(linkDir, 'index.html'))
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
