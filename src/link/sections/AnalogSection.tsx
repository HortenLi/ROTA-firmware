import { useTranslation } from 'react-i18next'

/**
 * Section 06 — the brand beat. No features, no claims: material, light and one
 * sentence. The band is styled in CSS (warm directional light, grain, film
 * sprockets) so it degrades to a designed surface even if the photo is absent.
 */
export default function AnalogSection() {
  const { t } = useTranslation()
  return (
    <section className="lk-analog">
      <div className="lk-analog-media" aria-hidden="true" />
      <div className="lk-analog-grain" aria-hidden="true" />
      <div className="lk-wrap lk-analog-inner" data-reveal>
        <span className="lk-kicker lk-kicker-brass">{t('link.analog.eyebrow')}</span>
        <h2 className="lk-h2 lk-h2-lg">{t('link.analog.title')}</h2>
        <p className="lk-analog-body">{t('link.analog.body')}</p>
        <span className="lk-analog-cap">{t('link.analog.caption')}</span>
      </div>
      <div className="lk-sprocket" aria-hidden="true" />
    </section>
  )
}
