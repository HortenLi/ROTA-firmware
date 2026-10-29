import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useDocumentMeta, useReveal } from '../link/Stage'
import { RELEASES_URL, REPO_URL } from '../content'
import { brandImg } from '../brand/media'
import { href } from '../router'
import { About, Docs, Install, Intro, Specs } from './Content'
import Firmware from './Firmware'

const SECTIONS = ['product', 'specs', 'firmware', 'install', 'docs', 'about'] as const

/**
 * Technical page. Everything that used to sit on the home page — confirmed
 * specifications, the GitHub release feed, install steps, docs — lives here
 * unchanged, so the brand home can stay a narrative.
 */
export default function R1Page() {
  const { t, i18n } = useTranslation()
  const revealRef = useReveal<HTMLDivElement>()

  const meta = useMemo(() => {
    const origin = window.location.origin
    return {
      title: `${t('hero.model')} — ${t('hero.tagline')}`,
      description: t('hero.lede'),
      ogTitle: `${t('hero.model')} — ${t('hero.tagline')}`,
      ogDescription: t('hero.lede'),
      ogImage: `${origin}${brandImg('og.png')}`,
      canonical: `${origin}${href('/r1')}`,
    }
  }, [t, i18n.language])

  useDocumentMeta(meta)

  return (
    <div className="bd r1" ref={revealRef}>
      <Nav />
      <main>
        <header className="r1-head">
          <div className="bd-shell">
            <p className="bd-kicker">
              ROTA {t('hero.model')} · {t('hero.tagline')}
            </p>
            <h1 className="r1-title">{t('hero.tagline')}</h1>
            <p className="bd-lede">{t('hero.lede')}</p>
            <div className="bd-hero-cta">
              <a className="bd-link" href={RELEASES_URL} target="_blank" rel="noreferrer">
                {t('hero.download')}
                <span aria-hidden="true">↓</span>
              </a>
              <a className="bd-link" href={REPO_URL} target="_blank" rel="noreferrer">
                {t('hero.viewGithub')}
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <nav className="r1-index" aria-label={t('nav.menu')}>
              {SECTIONS.map((s) => (
                <a key={s} href={`#${s}`}>
                  {t(`nav.${s}`)}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <Intro />
        <Specs />
        <Firmware />
        <Install />
        <Docs />
        <About />
      </main>
      <Footer />
    </div>
  )
}
