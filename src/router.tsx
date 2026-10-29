import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'

/**
 * Minimal history router — the site has exactly two pages (home + ROTA Link),
 * so a dependency-free pushState router beats pulling in react-router.
 *
 * GitHub Pages has no SPA rewrite, so `vite.config.ts` emits a `404.html`
 * that is a byte-copy of `index.html`: a deep link (or a refresh) on
 * /ROTA-firmware/link is served that copy with the URL intact, React reads
 * `location.pathname` and renders the same page. No redirect hack needed.
 */

const BASE = import.meta.env.BASE_URL // '/ROTA-firmware/'

export const HOME_PATH = '/'
export const LINK_PATH = '/link'
/** Technical page: specs, firmware releases, install steps, docs. */
export const R1_PATH = '/r1'
/** "The Person Behind ROTA" — the personal page. */
export const ABOUT_PATH = '/about'

export type Route = { path: string; hash: string }

function normalise(path: string): string {
  let p = path
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1) // keep the leading slash
  p = p.replace(/index\.html$/, '')
  p = p.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

function readLocation(): Route {
  return { path: normalise(window.location.pathname), hash: window.location.hash }
}

/** Absolute href for an internal path (respects the Pages base). */
export function href(path: string, hash?: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE
  const p = path === '/' ? base + '/' : base + path
  return hash ? `${p}${hash.startsWith('#') ? hash : `#${hash}`}` : p
}

type Ctx = { route: Route; navigate: (to: string) => void }
const RouterCtx = createContext<Ctx>({ route: { path: '/', hash: '' }, navigate: () => {} })

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(readLocation)

  useEffect(() => {
    const onPop = () => setRoute(readLocation())
    window.addEventListener('popstate', onPop)
    window.addEventListener('hashchange', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [])

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin + BASE)
    const next = { path: normalise(url.pathname), hash: url.hash }
    // Same page + only the hash changed: let the browser do the scrolling.
    if (next.path === readLocation().path) {
      if (next.hash) {
        window.history.pushState(null, '', url.pathname + url.hash)
        const el = document.getElementById(next.hash.slice(1))
        if (el) el.scrollIntoView({ block: 'start' })
        else window.scrollTo(0, 0)
        setRoute(next)
      }
      return
    }
    window.history.pushState(null, '', url.pathname + url.hash)
    setRoute(next)
    // New page: start at the top (or at the anchor, after paint). This jump is
    // instant on purpose — global.css sets `scroll-behavior: smooth`, which
    // would otherwise animate a multi-thousand-pixel slide on every page change.
    const jump: ScrollBehavior = 'instant'
    window.scrollTo({ top: 0, left: 0, behavior: jump })
    if (next.hash) {
      const id = next.hash.slice(1)
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: jump })
      })
    }
  }, [])

  const value = useMemo(() => ({ route, navigate }), [route, navigate])
  return <RouterCtx.Provider value={value}>{children}</RouterCtx.Provider>
}

export function useRoute(): Route {
  return useContext(RouterCtx).route
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

/** Internal link. Renders a real <a href> so middle-click / SEO still work. */
export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useContext(RouterCtx)
  const [path, hash] = to.split('#')
  const onLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={href(path || '/', hash ? `#${hash}` : undefined)} onClick={onLinkClick} {...rest}>
      {children}
    </a>
  )
}
