import { useTranslation } from 'react-i18next'
import { brandImg } from '../media'

const ITEMS = [
  { key: 'i1', img: 'origin-film.webp', w: 780, h: 780 },
  { key: 'i2', img: 'origin-lens.webp', w: 780, h: 780 },
  { key: 'i3', img: 'origin-tank.webp', w: 780, h: 780 },
] as const

/** 02 — The circle, and where the name comes from. */
export default function Origin() {
  const { t } = useTranslation()
  return (
    <section className="bd-sec bd-sec--paper bd-origin" id="origin">
      <div className="bd-shell">
        <header className="bd-head">
          <p className="bd-kicker" data-reveal>
            {t('brand.origin.kicker')}
          </p>
          <div className="bd-head-row">
            <h2 className="bd-h2" data-reveal>
              {t('brand.origin.title')}
            </h2>
            <p className="bd-lede" data-reveal>
              {t('brand.origin.lede')}
            </p>
          </div>
        </header>

        <ol className="bd-orbit">
          {ITEMS.map((it, i) => (
            <li key={it.key} data-reveal>
              <figure>
                <div className="bd-orbit-img">
                  <img
                    src={brandImg(it.img)}
                    alt={t(`brand.origin.${it.key}alt`)}
                    width={it.w}
                    height={it.h}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption>
                  <span className="bd-idx bd-num">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{t(`brand.origin.${it.key}k`)}</strong>
                  <span className="bd-orbit-text">{t(`brand.origin.${it.key}t`)}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <div className="bd-note">
          <p data-reveal>{t('brand.origin.body')}</p>
          <p className="bd-note-mark" data-reveal>
            {t('brand.origin.note')}
          </p>
        </div>
      </div>
    </section>
  )
}
