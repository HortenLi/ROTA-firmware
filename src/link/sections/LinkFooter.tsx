import { useTranslation } from 'react-i18next'
import { REPO_URL } from '../../content'
import { Link, R1_PATH } from '../../router'

export default function LinkFooter() {
  const { t } = useTranslation()
  return (
    <footer className="lk-foot">
      <div className="lk-wrap">
        <div className="lk-foot-top">
          <div className="lk-foot-brand">
            <span className="lk-foot-wordmark">R O T A</span>
            <span className="lk-foot-sub">Link</span>
          </div>
          <nav className="lk-foot-nav" aria-label={t('nav.menu')}>
            <Link to="/link">{t('link.footer.app')}</Link>
            <Link to={R1_PATH}>{t('link.footer.hw')}</Link>
            {/* firmware now lives on the technical page, not the brand home */}
            <Link to={`${R1_PATH}#firmware`}>{t('link.footer.firmware')}</Link>
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              {t('link.footer.repo')} ↗
            </a>
          </nav>
        </div>
        <div className="lk-foot-bottom">
          <span>{t('link.footer.copyright')}</span>
          <span>{t('footer.langNote')}</span>
        </div>
      </div>
    </footer>
  )
}
