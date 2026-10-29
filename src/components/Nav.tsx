import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { changeLang, LANG_LABELS, type Lang, SUPPORTED } from '../i18n'
import { REPO_URL } from '../content'
import { ABOUT_PATH, LINK_PATH, Link, R1_PATH, useRoute } from '../router'

function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = i18n.language as Lang
  return (
    <div className="lang-switch" role="group" aria-label={t('nav.language')}>
      {SUPPORTED.map((l) => (
        <button
          key={l}
          className={current === l ? 'on' : ''}
          aria-pressed={current === l}
          onClick={() => void changeLang(l)}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  )
}

/**
 * Nav. On the brand home it floats over the hero (no bar until you scroll);
 * everywhere else it is solid, because those pages open on light ground.
 */
export default function Nav() {
  const { t } = useTranslation()
  const route = useRoute()
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const home = route.path === '/'
  const onR1 = route.path === R1_PATH
  const onApp = route.path === LINK_PATH
  const onAbout = route.path === ABOUT_PATH

  useEffect(() => {
    if (!home) {
      setSolid(true)
      return
    }
    const onScroll = () => setSolid(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [home])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('click', onDoc)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // the drawer is reachable by keyboard, so it has to close by keyboard too
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const links = [
    { to: '/', label: t('brand.nav.brand'), on: home },
    { to: R1_PATH, label: t('brand.nav.r1'), on: onR1 },
    { to: LINK_PATH, label: t('brand.nav.app'), on: onApp },
    { to: `${R1_PATH}#firmware`, label: t('brand.nav.firmware'), on: false },
    { to: ABOUT_PATH, label: t('brand.nav.about'), on: onAbout },
  ]

  return (
    <>
      <header className={`nav bd-nav${solid ? ' is-solid' : ''}`}>
        <div className="bd-shell bd-nav-in">
          <Link className="wordmark" to="/" aria-label="ROTA">
            R O T A
          </Link>

          <nav className="bd-nav-links" aria-label={t('nav.menu')}>
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={l.on ? 'is-on' : undefined}
                aria-current={l.on ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="bd-nav-right">
            <LanguageSwitcher />
            <a className="bd-nav-gh" href={REPO_URL} target="_blank" rel="noreferrer">
              {t('nav.github')}
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <button
            className="bd-nav-burger"
            aria-expanded={open}
            aria-label={open ? t('nav.close') : t('nav.menu')}
            onClick={(e) => {
              e.stopPropagation()
              setOpen((v) => !v)
            }}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      <div ref={menuRef} className={`bd-drawer${open ? ' is-open' : ''}`}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <a href={REPO_URL} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
          {t('nav.github')} ↗
        </a>
        <LanguageSwitcher />
      </div>
    </>
  )
}
