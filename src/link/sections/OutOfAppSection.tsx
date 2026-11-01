import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stage } from '../Stage'
import { ChevronIcon } from '../icons'
import { HomeScreen, type WidgetState } from '../WidgetUI'
import NotificationPart from './NotificationSection'

/**
 * Section 04 — Out of the app.
 *
 * One chapter, two halves, because they are one experience: the same run is
 * visible on the home screen and in the shade, and neither of them needs the
 * app to be open. 01 is the widgets (brand-facing: paper, illustration, film
 * rail, a rotating line), 02 is the notification (function-facing: the number,
 * the stage, three actions). They share the type and the palette and nothing
 * else — deliberately.
 *
 * The launcher is a carousel of three arrangements, one per real widget size
 * (widget_4x2 / widget_4x1 / widget_2x2). Each slide is the *same* layout
 * twice — light and dark — so the pair differs only in the system theme. The
 * question every slide answers is the same: where does this card go on a
 * screen that is already full of apps, badges and a folder?
 *
 * One card per screen, never two: nobody puts the same widget twice on a
 * launcher, and two cards in two states side by side would be a lie about
 * what the widget actually does. So the card keeps its place and changes what
 * it is doing — running, then at rest — and the caption under the pair names
 * the state, not the size.
 */
const SLIDES = [
  { arrange: 'wide', copy: 's1' },
  { arrange: 'slim', copy: 's2' },
  { arrange: 'square', copy: 's3' },
] as const
const LIVE_MS = 5200
const IDLE_MS = 4200

export default function OutOfAppSection() {
  const { t } = useTranslation()
  const [i, setI] = useState(0)
  const [state, setState] = useState<WidgetState>('live')
  const n = SLIDES.length
  const slide = SLIDES[i]
  const go = (d: number) => setI((p) => (p + d + n) % n)

  // a timer is either running or it is not — the theme has nothing to do with
  // it, which is exactly why both phones show the same state at the same time
  useEffect(() => {
    const id = window.setTimeout(() => setState((s) => (s === 'live' ? 'idle' : 'live')), state === 'live' ? LIVE_MS : IDLE_MS)
    return () => window.clearTimeout(id)
  }, [state])

  const facts = [1, 2, 3, 4].map((k) => ({ t: t(`link.out.f${k}t`), d: t(`link.out.f${k}d`) }))

  return (
    <section className="lk-sec" id="outofapp">
      <div className="lk-wrap">
        {/* ---------- the chapter ---------- */}
        <div className="lk-head" data-reveal>
          <span className="lk-kicker">{t('link.out.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.out.title')}</h2>
          <p className="lk-lede">{t('link.out.body')}</p>
        </div>

        {/* ---------- 01 · home screen widgets ---------- */}
        <div className="lk-out-sub">
          <div className="lk-sub-head" data-reveal>
            <span className="lk-kicker">{t('link.out.wEyebrow')}</span>
            <h3 className="lk-sub-h">{t('link.out.wTitle')}</h3>
            <p className="lk-lede">{t('link.out.wBody')}</p>
          </div>

          <div className="lk-wcar" data-reveal>
            <button
              type="button"
              className="lk-wcar-arrow is-side is-prev"
              onClick={() => go(-1)}
              aria-label={t('link.out.prevA')}
            >
              <ChevronIcon size={18} className="lk-wcar-chev" />
            </button>

            <div className="lk-wcar-track" key={slide.arrange}>
              <figure className="lk-homefig">
                <div className="lk-home-frame">
                  <Stage width={390} height={844}>
                    <HomeScreen theme="light" arrange={slide.arrange} state={state} />
                  </Stage>
                </div>
                <figcaption>{t('link.out.lightL')}</figcaption>
              </figure>

              <figure className="lk-homefig">
                <div className="lk-home-frame">
                  <Stage width={390} height={844}>
                    <HomeScreen theme="dark" arrange={slide.arrange} state={state} />
                  </Stage>
                </div>
                <figcaption>{t('link.out.darkL')}</figcaption>
              </figure>
            </div>

            <div className={`lk-wcar-state is-${state}`} aria-hidden="true">
              <span key={state} className="lk-wcar-statein">
                <i />
                {t(state === 'live' ? 'link.out.stateLive' : 'link.out.stateIdle')}
              </span>
            </div>

            <button
              type="button"
              className="lk-wcar-arrow is-side is-next"
              onClick={() => go(1)}
              aria-label={t('link.out.nextA')}
            >
              <ChevronIcon size={18} className="lk-wcar-chev" />
            </button>
          </div>

          <div className="lk-wcar-foot" data-reveal>
            <div className="lk-wcar-lead" aria-live="polite">
              <span className="lk-wcar-count">
                {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
              </span>
              <h4 className="lk-wcar-name">{t(`link.out.${slide.copy}k`)}</h4>
              <p className="lk-wcar-d">{t(`link.out.${slide.copy}d`)}</p>
            </div>

            <div className="lk-wcar-nav">
              <button
                type="button"
                className="lk-wcar-arrow is-inline is-prev"
                onClick={() => go(-1)}
                aria-label={t('link.out.prevA')}
              >
                <ChevronIcon size={16} className="lk-wcar-chev" />
              </button>
              <span className="lk-wcar-dots">
                {SLIDES.map((s, k) => (
                  <button
                    key={s.arrange}
                    type="button"
                    className={k === i ? 'on' : ''}
                    onClick={() => setI(k)}
                    aria-label={t(`link.out.${s.copy}k`)}
                    aria-current={k === i}
                  />
                ))}
              </span>
              <button
                type="button"
                className="lk-wcar-arrow is-inline is-next"
                onClick={() => go(1)}
                aria-label={t('link.out.nextA')}
              >
                <ChevronIcon size={16} className="lk-wcar-chev" />
              </button>
            </div>
          </div>

          <dl className="lk-facts is-2x2" data-reveal>
            {facts.map((f) => (
              <div className="lk-fact" key={f.t}>
                <dt>{f.t}</dt>
                <dd>{f.d}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- 02 · notification controls ---------- */}
        <NotificationPart />

        {/* ---------- closing ---------- */}
        <div className="lk-outro" data-reveal>
          <p className="lk-outro-t">{t('link.out.outroT')}</p>
          <p className="lk-outro-d">{t('link.out.outroD')}</p>
          <span className="lk-outro-s">{t('link.out.outroS')}</span>
        </div>
      </div>
    </section>
  )
}
