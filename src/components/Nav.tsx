import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { changeLang, LANG_LABELS, type Lang, SUPPORTED } from '../i18n'
import { NAV_SECTIONS, REPO_URL } from '../content'

function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = i18n.language as Lang
  return (
    <div
      className="lang-switch"
      role="group"
      aria-label={t('nav.language')}
    >
      {SUPPORTED.map((l) => (
        <button
          key={l}
          className={current === l ? 'on' : ''}
          aria-pressed={current === l}
          title={current === l ? t('lang.current') : undefined}
          onClick={() => void changeLang(l)}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  )
}

export default function Nav() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close the mobile menu when clicking outside or resizing up.
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth > 860) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('click', onDoc)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const sectionHref = (id: string) => `#${id}`

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a className="wordmark" href="#top" aria-label="ROTA">
            ROTA
          </a>
          <nav className="nav-links" aria-label={t('nav.menu')}>
            {NAV_SECTIONS.map((s) => (
              <a key={s} href={sectionHref(s)}>
                {t(`nav.${s}`)}
              </a>
            ))}
          </nav>
          <div className="nav-desktop-lang">
            <LanguageSwitcher />
          </div>
          <a
            className="nav-links"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            style={{ flex: 'none' }}
          >
            {t('nav.github')}
          </a>
          <button
            className="nav-burger"
            aria-expanded={open}
            aria-label={open ? t('nav.close') : t('nav.menu')}
            onClick={(e) => {
              e.stopPropagation()
              setOpen((v) => !v)
            }}
          >
            {open ? t('nav.close') : t('nav.menu')}
          </button>
        </div>
      </header>
      <div
        ref={menuRef}
        className={`mobile-menu${open ? ' open' : ''}`}
      >
        {NAV_SECTIONS.map((s) => (
          <a
            key={s}
            className="mlink"
            href={sectionHref(s)}
            onClick={() => setOpen(false)}
          >
            {t(`nav.${s}`)}
          </a>
        ))}
        <a
          className="mlink"
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
        >
          {t('nav.github')} ↗
        </a>
        <LanguageSwitcher />
      </div>
    </>
  )
}
