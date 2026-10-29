import { useTranslation } from 'react-i18next'
import { Link, R1_PATH, LINK_PATH } from '../../router'
import { brandImg } from '../media'
import { Dial } from '../Dial'

/**
 * 01 — Hero.
 *
 * Three grid areas so the phone layout can put the ring between the headline
 * and the supporting copy without duplicating any markup.
 */
export default function BrandHero() {
  const { t } = useTranslation()
  return (
    <section className="bd-hero" id="top">
      <div className="bd-shell bd-hero-in">
        <div className="bd-hero-lead">
          <p className="bd-kicker" data-reveal>
            {t('brand.hero.kicker')}
          </p>
          <h1 className="bd-display" data-reveal>
            {t('brand.hero.title')}
          </h1>
        </div>

        <div className="bd-hero-figure" data-reveal>
          <div className="bd-ring">
            <img
              src={brandImg('hero-lens.webp')}
              alt={t('brand.hero.imgAlt')}
              width={1100}
              height={1100}
              decoding="async"
              fetchPriority="high"
            />
            <Dial className="bd-ring-dial" />
            <span className="bd-ring-mark" aria-hidden="true" />
          </div>
        </div>

        <div className="bd-hero-tail">
          <p className="bd-lede" data-reveal>
            {t('brand.hero.lede')}
          </p>
          <div className="bd-hero-cta" data-reveal>
            <Link className="bd-link" to={R1_PATH}>
              {t('brand.hero.ctaR1')}
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="bd-link" to={LINK_PATH}>
              {t('brand.hero.ctaApp')}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <dl className="bd-shell bd-rail">
        <div>
          <dt>{t('brand.hero.rail1k')}</dt>
          <dd className="bd-num">{t('brand.hero.rail1v')}</dd>
        </div>
        <div>
          <dt>{t('brand.hero.rail2k')}</dt>
          <dd className="bd-num">{t('brand.hero.rail2v')}</dd>
        </div>
        <div>
          <dt>{t('brand.hero.rail3k')}</dt>
          <dd className="bd-num">{t('brand.hero.rail3v')}</dd>
        </div>
      </dl>
    </section>
  )
}
