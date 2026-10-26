import { useTranslation } from 'react-i18next'
import { REPO_URL } from '../content'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <span className="wordmark">ROTA</span>
          <div className="foot-links">
            <a href="#top">{t('footer.top')}</a>
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              {t('footer.repo')}
            </a>
            <a href={`${REPO_URL}/releases`} target="_blank" rel="noreferrer">
              {t('nav.firmware')}
            </a>
          </div>
        </div>
        <div className="foot-note">
          <span>© {year} {t('footer.rights')}</span>
          <span>{t('footer.langNote')}</span>
        </div>
      </div>
    </footer>
  )
}
