import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FilmLogCard, { FILM_CARDS } from '../FilmLogCard'
import { Stage } from '../Stage'
import { ChevronIcon } from '../icons'

/**
 * Section 05 — Film Log. The visual is the export itself: the card is rebuilt at
 * its real 1080 px width and scaled, so the page shows the artefact rather than
 * a screenshot of the editor. No device frame, because the PNG has none.
 *
 * Three cards sit behind one set of arrows. They are not three variations for
 * decoration: each one is a different format, so each one makes the row planner
 * behave differently — two portraits side by side, a landscape and a portrait
 * sharing a row on 6×7, a near-square full-frame scan taking a row alone.
 */
export default function FilmLogSection() {
  const { t } = useTranslation()
  const [i, setI] = useState(0)
  const card = FILM_CARDS[i]
  const n = FILM_CARDS.length
  const go = (d: number) => setI((p) => (p + d + n) % n)

  const fields = [1, 2, 3, 4, 5, 6].map((k) => ({ k: t(`link.film.f${k}k`), v: t(`link.film.f${k}v`) }))
  const facts = [1, 2, 3].map((k) => ({ t: t(`link.film.g${k}t`), d: t(`link.film.g${k}d`) }))

  return (
    <section className="lk-sec" id="film-log">
      <div className="lk-wrap">
        <div className="lk-head" data-reveal>
          <span className="lk-kicker">{t('link.film.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.film.title')}</h2>
          <p className="lk-lede">{t('link.film.body')}</p>
        </div>

        <div className="lk-film-grid">
          <figure className="lk-film-figure" data-reveal>
            <div className="lk-film-frame">
              <button
                type="button"
                className="lk-film-arrow is-side is-prev"
                onClick={() => go(-1)}
                aria-label={t('link.film.prevA')}
              >
                <ChevronIcon size={20} className="lk-film-chev" />
              </button>

              <div className="lk-film-print">
                <Stage width={1080} className="lk-film-stage">
                  <FilmLogCard card={card} key={card.id} />
                </Stage>
              </div>

              <button
                type="button"
                className="lk-film-arrow is-side is-next"
                onClick={() => go(1)}
                aria-label={t('link.film.nextA')}
              >
                <ChevronIcon size={20} className="lk-film-chev" />
              </button>
            </div>

            <div className="lk-film-nav" aria-live="polite">
              <button
                type="button"
                className="lk-film-arrow is-inline is-prev"
                onClick={() => go(-1)}
                aria-label={t('link.film.prevA')}
              >
                <ChevronIcon size={18} className="lk-film-chev" />
              </button>
              <span className="lk-film-count">
                {String(i + 1).padStart(2, '0')}
                <em> / {String(n).padStart(2, '0')}</em>
              </span>
              <span className="lk-film-stock">{t(`link.film.${card.id}s`)}</span>
              <button
                type="button"
                className="lk-film-arrow is-inline is-next"
                onClick={() => go(1)}
                aria-label={t('link.film.nextA')}
              >
                <ChevronIcon size={18} className="lk-film-chev" />
              </button>
            </div>

            <figcaption>
              <span className="lk-detail-k">{t('link.film.previewK')}</span>
              <span className="lk-detail-v">{t(`link.film.${card.id}p`)}</span>
            </figcaption>
          </figure>

          <div className="lk-film-copy" data-reveal>
            <div className="lk-film-copy-in">
              <div className="lk-film-fields">
                <h3 className="lk-h3">{t('link.film.fieldsTitle')}</h3>
                <dl>
                  {fields.map((f) => (
                    <div key={f.k}>
                      <dt>{f.k}</dt>
                      <dd>{f.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lk-film-facts">
                {facts.map((f) => (
                  <div key={f.t}>
                    <h4>{f.t}</h4>
                    <p>{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
