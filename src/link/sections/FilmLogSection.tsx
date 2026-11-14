import { useTranslation } from 'react-i18next'
import FilmLogCard, { FILM_CARDS } from '../FilmLogCard'
import PrintCard, { PRINT_PAPERS, PRINT_SHEETS } from '../PrintCard'
import { Stage } from '../Stage'

/**
 * Chapter 04 — the film log, which since v0.16 is two templates behind one
 * switch (`TemplateSwitch` in `FilmLogScreen.kt`): the archive card that holds
 * a whole roll, and the print that holds a single frame on a sheet of coloured
 * paper. They answer different questions, so they get different sub-chapters
 * instead of being averaged into one grid.
 */
export default function FilmLogSection() {
  const { t } = useTranslation()
  const fields = [1, 2, 3, 4, 5, 6].map((k) => ({ k: t(`link.film.f${k}k`), v: t(`link.film.f${k}v`) }))
  const printFields = [1, 2, 3, 4].map((k) => ({ k: t(`link.film.q${k}k`), v: t(`link.film.q${k}v`) }))
  const facts = [1, 2, 3].map((k) => ({ t: t(`link.film.g${k}t`), d: t(`link.film.g${k}d`) }))
  const printFacts = [1, 2, 3].map((k) => ({ t: t(`link.film.p${k}t`), d: t(`link.film.p${k}d`) }))

  return (
    <section className="lk-sec lkx-section lkx-film" id="film-log">
      <div className="lk-wrap">
        <div className="lk-head lkx-head" data-reveal>
          <span className="lk-kicker">{t('link.film.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.film.title')}</h2>
          <p className="lk-lede">{t('link.film.body')}</p>
        </div>

        {/* 01 — the archive card: one roll, every frame ratio, the process printed. */}
        <div className="lkx-tmpl" data-reveal>
          <div className="lkx-tmpl-head">
            <span className="lkx-tmpl-no">A</span>
            <div className="lkx-tmpl-copy">
              <h3 className="lkx-tmpl-name">
                {t('link.film.archive')}
                <span>{t('link.film.archiveTag')}</span>
              </h3>
              <p>{t('link.film.archiveBody')}</p>
            </div>
          </div>

          <div className="lkx-film-gallery">
            {FILM_CARDS.map((card, index) => (
              <figure className="lkx-film-item" key={card.id}>
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
        </div>

        {/* 02 — the print: one frame, one paper colour, exported as a picture. */}
        <div className="lkx-tmpl lkx-tmpl-print" data-reveal>
          <div className="lkx-tmpl-head">
            <span className="lkx-tmpl-no">B</span>
            <div className="lkx-tmpl-copy">
              <h3 className="lkx-tmpl-name">
                {t('link.film.print')}
                <span>{t('link.film.printTag')}</span>
              </h3>
              <p>{t('link.film.printBody')}</p>
            </div>
          </div>

          <div className="lkx-print">
            <div className="lkx-print-sheets">
              {PRINT_SHEETS.map((sheet) => (
                <figure className="lkx-print-sheet" key={sheet.source}>
                  <Stage width={1080} height={1080 * (sheet.ratio === 11 ? 1 : 1.25)} className="lkx-print-stage">
                    <PrintCard data={sheet} />
                  </Stage>
                  {/* The sheet is drawn at 1080 px and scaled to ~350–360 px, which
                      puts its own camera line at 2–6 px. That line is texture on
                      the card; here it is set at a size that can be read. */}
                  <figcaption>
                    <span>{t(`link.film.${sheet.ratio === 11 ? 'p11' : 'p45'}`)}</span>
                    <span className="lkx-print-cam">{t(`link.film.${sheet.source}c`)}</span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="lkx-print-spec">
              <div className="lkx-print-facts">
                {printFacts.map((f, k) => (
                  <div key={f.t}>
                    <span>{String(k + 1).padStart(2, '0')}</span>
                    <h3>{f.t}</h3>
                    <p>{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lkx-papers">
            <div className="lkx-papers-strip" aria-hidden="true">
              {PRINT_PAPERS.map((hex) => (
                <i key={hex} style={{ background: hex }} />
              ))}
            </div>
            <span className="lkx-papers-cap">{t('link.film.paletteK')}</span>
          </div>
        </div>

        <div className="lkx-film-notes" data-reveal>
          <div className="lk-film-facts lkx-film-facts">
            {facts.map((f, k) => <div key={f.t}><span>{String(k + 1).padStart(2, '0')}</span><h3>{f.t}</h3><p>{f.d}</p></div>)}
          </div>
          <details className="lkx-details">
            <summary>{t('link.film.fieldsTitle')}</summary>
            <div className="lkx-dl-grid">
              <div>
                <span className="lkx-dl-cap">{t('link.film.archive')} · {t('link.film.archiveTag')}</span>
                <dl className="lk-film-fields">
                  {fields.map((f) => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}
                </dl>
              </div>
              <div>
                <span className="lkx-dl-cap">{t('link.film.print')} · {t('link.film.printTag')}</span>
                <dl className="lk-film-fields">
                  {printFields.map((f) => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}
                </dl>
              </div>
            </div>
          </details>
        </div>
      </div>
    </section>
  )
}
