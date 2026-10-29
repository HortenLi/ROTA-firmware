import { useTranslation } from 'react-i18next'
import { LandscapeTimer, OverviewPlate, TimerCardPlate } from '../AppUI'
import { Stage } from '../Stage'

/**
 * Section 02 — the timer. A landscape full-screen run is the main image: it is
 * the most instrument-like view the app has, and it is the one the user actually
 * stares at while developing.
 */
export default function TimerSection() {
  const { t } = useTranslation()
  const facts = [1, 2, 3].map((i) => ({ t: t(`link.timer.f${i}t`), d: t(`link.timer.f${i}d`) }))
  return (
    <section className="lk-sec" id="app">
      <div className="lk-wrap">
        <div className="lk-head" data-reveal>
          <span className="lk-kicker">{t('link.timer.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.timer.title')}</h2>
          <p className="lk-lede">{t('link.timer.body')}</p>
        </div>

        <figure className="lk-figure" data-reveal>
          <div className="lk-screen">
            <Stage width={844} height={390}>
              <LandscapeTimer linked={false} offset={219} />
            </Stage>
          </div>
          <figcaption className="lk-figcap lk-figcap-wide">
            <span className="lk-figcap-rule" aria-hidden="true" />
            {t('link.hero.figureCaption')}
          </figcaption>
        </figure>

        <div className="lk-details" data-reveal>
          <figure className="lk-detail">
            <div className="lk-detail-frame">
              <Stage width={390}>
                <TimerCardPlate />
              </Stage>
            </div>
            <figcaption>
              <span className="lk-detail-k">{t('link.timer.detail1k')}</span>
              <span className="lk-detail-v">{t('link.timer.detail1v')}</span>
            </figcaption>
          </figure>

          <figure className="lk-detail">
            <div className="lk-detail-frame">
              <Stage width={390}>
                <OverviewPlate />
              </Stage>
            </div>
            <figcaption>
              <span className="lk-detail-k">{t('link.timer.detail2k')}</span>
              <span className="lk-detail-v">{t('link.timer.detail2v')}</span>
            </figcaption>
          </figure>
        </div>

        <dl className="lk-facts" data-reveal>
          {facts.map((f) => (
            <div className="lk-fact" key={f.t}>
              <dt>{f.t}</dt>
              <dd>{f.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
