import { useTranslation } from 'react-i18next'

/**
 * 06 — Signature. The page returns to the ring it opened with: two hairlines,
 * almost entirely off-canvas, turning very slowly.
 */
export default function Closing() {
  const { t } = useTranslation()
  return (
    <section className="bd-close" id="signature">
      <div className="bd-close-art" aria-hidden="true">
        <span className="bd-close-ring bd-close-ring--outer" />
        <span className="bd-close-ring bd-close-ring--inner" />
        <span className="bd-close-dot" />
      </div>
      <div className="bd-shell bd-close-in">
        <p className="bd-kicker" data-reveal>
          {t('brand.close.kicker')}
        </p>
        <h2 className="bd-close-title" data-reveal>
          {t('brand.close.title')}
        </h2>
        <p className="bd-close-slogan" data-reveal>
          {t('brand.close.slogan')}
        </p>
      </div>
    </section>
  )
}
