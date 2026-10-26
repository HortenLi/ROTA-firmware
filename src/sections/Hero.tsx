import { useTranslation } from 'react-i18next'
import { RELEASES_URL, REPO_URL } from '../content'

export default function Hero() {
  const { t } = useTranslation()
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <h1 className="wordmark-hero">{t('hero.brand')}</h1>
        <div className="model-tag">
          {t('hero.model')} · {t('hero.tagline')}
        </div>
        <p className="slogan">{t('hero.slogan')}</p>
        <p className="lede">{t('hero.lede')}</p>
        <div className="cta-row">
          <a className="btn btn-solid" href={RELEASES_URL} target="_blank" rel="noreferrer">
            {t('hero.download')} ↓
          </a>
          <a className="btn btn-outline" href={REPO_URL} target="_blank" rel="noreferrer">
            {t('hero.viewGithub')} ↗
          </a>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true" />
    </section>
  )
}
