import { useTranslation } from 'react-i18next'
import { personImg } from '../media'
import { PHOTOS } from '../photos'

/**
 * Section 03 — the gallery. Editorial rather than a card grid: each frame
 * keeps its own crop and sits on a 3-column grid whose column span is chosen
 * per photo. No rounded corners, no filter, no hover zoom.
 */
export default function Film() {
  const { t } = useTranslation()
  return (
    <section className="bd-sec pr-film" id="film">
      <div className="bd-shell">
        <header className="bd-head">
          <p className="bd-kicker" data-reveal>
            {t('person.film.kicker')}
          </p>
          <div className="bd-head-row">
            <h2 className="bd-h2" data-reveal>
              {t('person.film.title')}
            </h2>
            <p className="bd-lede" data-reveal>
              {t('person.film.lede')}
            </p>
          </div>
        </header>

        <div className="pr-gallery">
          {PHOTOS.map((p, i) => (
            <figure className={`pr-shot pr-shot--${p.span}`} key={p.file} data-reveal>
              <img
                src={personImg(p.file)}
                alt={t(p.altKey)}
                width={p.w}
                height={p.h}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span className="bd-idx bd-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="pr-stock">{p.film}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="pr-film-note" data-reveal>
          {t('person.film.note')}
        </p>
      </div>
    </section>
  )
}
