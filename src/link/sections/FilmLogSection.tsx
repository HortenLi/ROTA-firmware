import { useTranslation } from 'react-i18next'
import FilmLogCard, { FILM_CARDS } from '../FilmLogCard'
import { Stage } from '../Stage'

export default function FilmLogSection() {
  const { t } = useTranslation()
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

        <div className="lkx-film-gallery">
          {FILM_CARDS.map((card, index) => (
            <figure className="lkx-film-item" key={card.id} data-reveal>
              <div className="lkx-film-item-top">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{t(`link.film.${card.id}s`)}</span>
              </div>
              <div className="lk-film-print">
                <Stage width={1080} className="lk-film-stage"><FilmLogCard card={card} /></Stage>
              </div>
              <figcaption>
                <span className="lk-detail-k">{t('link.film.previewK')}</span>
                <span className="lk-detail-v">{t(`link.film.${card.id}p`)}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="lkx-film-notes" data-reveal>
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
      </div>
    </section>
  )
}
