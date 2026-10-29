import { useTranslation } from 'react-i18next'
import { LINK_PATH, Link, R1_PATH } from '../../router'

/**
 * Section 05 — back to the ring, and the way out.
 * Same slogan as the brand home; no new claim, no second tagline.
 */
export default function Closing() {
  const { t } = useTranslation()
  return (
    <section className="bd-sec bd-sec--ink pr-close" id="signature">
      <div className="bd-shell pr-close-in">
        <div className="pr-close-art" aria-hidden="true">
          <span className="pr-close-ring pr-close-ring--outer" />
          <span className="pr-close-ring pr-close-ring--inner" />
          <span className="pr-close-dot" />
        </div>

        <p className="bd-kicker" data-reveal>
          {t('person.close.kicker')}
        </p>
        <h2 className="pr-close-title" data-reveal>
          {t('person.close.title')}
        </h2>
        <p className="pr-close-lede" data-reveal>
          {t('person.close.lede')}
        </p>

        <div className="pr-close-cta" data-reveal>
          <Link className="bd-link" to="/">
            {t('person.close.back')}
          </Link>
          <Link className="bd-link" to={R1_PATH}>
            {t('person.close.product')}
          </Link>
          <Link className="bd-link" to={LINK_PATH}>
            {t('person.close.app')}
          </Link>
        </div>
      </div>
    </section>
  )
}
