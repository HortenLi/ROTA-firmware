import { useTranslation } from 'react-i18next'
import { LINK_PATH, Link, R1_PATH } from '../../router'
import { brandImg } from '../media'

/** 05 — In practice: the only section that talks about products, and only
 *  about the ones that exist. */
export default function Practice() {
  const { t } = useTranslation()
  const r1Facts = [
    ['r1f1k', 'r1f1v'],
    ['r1f2k', 'r1f2v'],
    ['r1f3k', 'r1f3v'],
    ['r1f4k', 'r1f4v'],
  ] as const

  return (
    <section className="bd-sec bd-sec--paper bd-practice" id="practice">
      <div className="bd-shell">
        <header className="bd-head">
          <p className="bd-kicker" data-reveal>
            {t('brand.practice.kicker')}
          </p>
          <div className="bd-head-row">
            <h2 className="bd-h2" data-reveal>
              {t('brand.practice.title')}
            </h2>
            <p className="bd-lede" data-reveal>
              {t('brand.practice.lede')}
            </p>
          </div>
        </header>

        <div className="bd-practice-grid">
          <figure className="bd-practice-fig" data-reveal>
            <img
              src={brandImg('practice-strip.webp')}
              alt={t('brand.practice.imgAlt')}
              width={980}
              height={1307}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{t('brand.practice.imgCap')}</figcaption>
          </figure>

          <div className="bd-products">
            <div data-reveal>
            <Link className="bd-product" to={R1_PATH}>
              <div className="bd-product-head">
                <h3>{t('brand.practice.r1name')}</h3>
                <span>{t('brand.practice.r1kind')}</span>
              </div>
              <p className="bd-product-desc">{t('brand.practice.r1desc')}</p>
              <dl className="bd-facts">
                {r1Facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{t(`brand.practice.${k}`)}</dt>
                    <dd className="bd-num">{t(`brand.practice.${v}`)}</dd>
                  </div>
                ))}
              </dl>
              <span className="bd-go">
                {t('brand.practice.r1go')}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
            </div>

            <div data-reveal>
            <Link className="bd-product" to={LINK_PATH}>
              <div className="bd-product-head">
                <h3>{t('brand.practice.linkname')}</h3>
                <span>{t('brand.practice.linkkind')}</span>
              </div>
              <p className="bd-product-desc">{t('brand.practice.linkdesc')}</p>
              <span className="bd-go">
                {t('brand.practice.linkgo')}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
            </div>

            <p className="bd-fineprint">{t('brand.practice.note')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
