import { useTranslation } from 'react-i18next'
import { REPO_URL } from '../content'
import { LINK_PATH, Link, R1_PATH } from '../router'

/** Site footer — shared by the brand home and the technical page. */
export default function Footer({ credits = false }: { credits?: boolean }) {
  const { t } = useTranslation()

  // the credit belongs to the page that actually shows the photographs
  const toTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' })
  }

  return (
    <footer className="site-foot bd-foot">
      <div className="bd-shell">
        <div className="bd-foot-top">
          <div className="bd-foot-brand">
            <span className="wordmark" aria-label="ROTA">
              R O T A
            </span>
            <p>{t('brand.footer.tagline')}</p>
          </div>

          <nav className="bd-foot-cols" aria-label={t('nav.menu')}>
            <div>
              <h2>{t('brand.footer.colProduct')}</h2>
              <Link to={R1_PATH}>{t('brand.footer.r1')}</Link>
              <Link to={LINK_PATH}>{t('brand.footer.app')}</Link>
            </div>
            <div>
              <h2>{t('brand.footer.colResources')}</h2>
              <Link to={`${R1_PATH}#firmware`}>{t('brand.footer.firmware')}</Link>
              <Link to={`${R1_PATH}#docs`}>{t('brand.footer.docs')}</Link>
            </div>
            <div>
              <h2>{t('brand.footer.colElsewhere')}</h2>
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                {t('brand.footer.repo')}
              </a>
              <a href={`${REPO_URL}#readme`} target="_blank" rel="noreferrer">
                {t('brand.footer.readme')}
              </a>
            </div>
          </nav>
        </div>

        <div className="bd-foot-bottom">
          <span>{t('brand.footer.rights')}</span>
          {credits && <span>{t('brand.footer.credits')}</span>}
          <a href="#top" className="bd-foot-top-link" onClick={toTop}>
            {t('brand.footer.top')}
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
