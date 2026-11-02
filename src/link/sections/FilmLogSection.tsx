import { useTranslation } from 'react-i18next'
import FilmLogCard, { FILM_CARDS } from '../FilmLogCard'
import { Stage } from '../Stage'
import { ChevronIcon } from '../icons'
import { useCarousel } from '../useCarousel'

const CARD_MS = 10000

export default function FilmLogSection() {
  const { t } = useTranslation()
  const car = useCarousel(FILM_CARDS.length, CARD_MS)
  const { i, dir, go } = car
  const card = FILM_CARDS[i]
  const n = FILM_CARDS.length
  const fields = [1, 2, 3, 4, 5, 6].map((k) => ({ k: t(`link.film.f${k}k`), v: t(`link.film.f${k}v`) }))
  const facts = [1, 2, 3].map((k) => ({ t: t(`link.film.g${k}t`), d: t(`link.film.g${k}d`) }))

  return (
    <section className="lk-sec lkx-section lkx-film" id="film-log">
      <div className="lk-wrap">
        <div className="lk-head lkx-head" data-reveal>
          <span className="lk-kicker">{t('link.film.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.film.title')}</h2>
          <p className="lk-lede">{t('link.film.body')}</p>
        </div>

        <div className="lk-film-grid lkx-film-grid">
          <figure className={`lk-film-figure${car.dragging ? ' is-dragging' : ''}`} data-reveal ref={car.host} {...car.hostProps}>
            <div className="lk-film-frame" style={{ ['--flm-dir' as string]: dir }}>
              <button type="button" className="lk-film-arrow is-side is-prev" onClick={() => go(-1)} aria-label={t('link.film.prevA')}><ChevronIcon size={20} className="lk-film-chev" /></button>
              <div className="lk-film-stack">
                {FILM_CARDS.map((c, k) => (
                  <div className="lk-film-pane" key={c.id} aria-hidden={k !== i} data-state={k === i ? 'on' : k === (i - 1 + n) % n ? 'prev' : 'next'}>
                    <div className="lk-film-print"><Stage width={1080} className="lk-film-stage"><FilmLogCard card={c} /></Stage></div>
                  </div>
                ))}
              </div>
              <button type="button" className="lk-film-arrow is-side is-next" onClick={() => go(1)} aria-label={t('link.film.nextA')}><ChevronIcon size={20} className="lk-film-chev" /></button>
            </div>
            <div className="lk-film-nav">
              <button type="button" className="lk-film-arrow is-inline is-prev" onClick={() => go(-1)} aria-label={t('link.film.prevA')}><ChevronIcon size={18} className="lk-film-chev" /></button>
              <span className="lk-film-count">{String(i + 1).padStart(2, '0')}<em> / {String(n).padStart(2, '0')}</em></span>
              <span className="lk-film-stock">{t(`link.film.${card.id}s`)}</span>
              <button type="button" className="lk-film-arrow is-inline is-next" onClick={() => go(1)} aria-label={t('link.film.nextA')}><ChevronIcon size={18} className="lk-film-chev" /></button>
            </div>
            <figcaption><span className="lk-detail-k">{t('link.film.previewK')}</span><span className="lk-detail-v">{t(`link.film.${card.id}p`)}</span></figcaption>
          </figure>

          <aside className="lk-film-copy lkx-film-copy" data-reveal>
            <div className="lk-film-copy-in">
              <div className="lk-film-facts lkx-film-facts">
                {facts.map((f, k) => <div key={f.t}><span>{String(k + 1).padStart(2, '0')}</span><h3>{f.t}</h3><p>{f.d}</p></div>)}
              </div>
              <details className="lkx-details">
                <summary>{t('link.film.fieldsTitle')}</summary>
                <dl className="lk-film-fields">
                  {fields.map((f) => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}
                </dl>
              </details>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
