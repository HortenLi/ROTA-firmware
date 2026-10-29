import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

let outDir = 'dist'
const ORIGIN = 'https://hortenli.github.io/ROTA-firmware'

type RouteMeta = { title: string; description: string; image?: string }

/**
 * Swaps the static head copy of a route shell. Crawlers and link unfurlers do
 * not run the client, so each deep link needs its own title and OG tags in the
 * HTML itself — React only corrects them afterwards, per language.
 */
function retitle(html: string, meta: RouteMeta): string {
  const set = (src: string, attr: 'name' | 'property', key: string, value: string) => {
    const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*`)
    return src.replace(re, `$1${value}`)
  }
  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${meta.description}`)
  out = set(out, 'property', 'og:title', meta.title)
  out = set(out, 'property', 'og:description', meta.description)
  if (meta.image) out = set(out, 'property', 'og:image', meta.image)
  return out
}

const ROUTE_META: Record<string, RouteMeta> = {
  r1: {
    title: 'ROTA R1 — Film Roller Processor',
    description:
      'Precision rotary processing for film: controlled rotation, precise temperature, reproducible results — firmware releases, documentation and specifications.',
    image: `${ORIGIN}/brand/og.png`,
  },
  link: {
    title: 'ROTA Link — Companion app',
    description:
      'A more considered way to process film. A precise, intuitive companion for your film processing workflow.',
    image: `${ORIGIN}/brand/og.png`,
  },
}

/**
 * GitHub Pages has no SPA rewrite, so both routes need a real HTML file:
 *
 *  - `<route>/index.html` — same shell, so /ROTA-firmware/link/ and /r1/ answer **200**
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
      const shell = readFileSync(index, 'utf8')
      copyFileSync(index, resolve(dir, '404.html'))
      for (const [route, meta] of Object.entries(ROUTE_META)) {
        const routeDir = resolve(dir, route)
        mkdirSync(routeDir, { recursive: true })
        writeFileSync(resolve(routeDir, 'index.html'), retitle(shell, meta))
      }
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
