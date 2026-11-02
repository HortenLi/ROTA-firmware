import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stage } from '../Stage'
import { ChevronIcon } from '../icons'
import { HomeScreen, Widget2x2, Widget4x1, Widget4x2, type WidgetState, type WidgetTheme } from '../WidgetUI'
import { useCarousel } from '../useCarousel'

const SLIDES = [
  { arrange: 'wide', copy: 's1', size: '4 × 2' },
  { arrange: 'slim', copy: 's2', size: '4 × 1' },
  { arrange: 'square', copy: 's3', size: '2 × 2' },
] as const

const SPECIMENS = [
  { id: 'wide', w: 358, h: 174 },
  { id: 'slim', w: 358, h: 82 },
  { id: 'square', w: 173, h: 174 },
] as const

const LIVE_MS = 5200
const IDLE_MS = 4200
const PALM = 'M110 350 Q120 185 130 85 Q50 15 5 45 Q68 32 130 85 Q110 20 78 0 Q132 25 130 85 Q165 5 230 18 Q168 42 130 85 Q220 70 250 125 Q180 94 130 85 Q180 140 205 190 Q155 130 130 85 Q75 130 30 195 Q65 125 130 85'

function PosterArt({ night }: { night: boolean }) {
  return (
    <>
      <span className="lk-post-art" aria-hidden="true">
        <i className="lk-post-sun" /><i className="lk-post-mtn" /><i className="lk-post-tri" /><i className="lk-post-stripe" />
        <i className="lk-post-dots is-a" /><i className="lk-post-dots is-b" />
        <span className="lk-post-palm is-l"><svg viewBox="0 0 250 350"><path d={PALM} /></svg></span>
        <span className="lk-post-palm is-r"><svg viewBox="0 0 250 350"><path d={PALM} /></svg></span>
        {night ? <i className="lk-post-glow" /> : null}
      </span>
      <span className="lk-post-tex" aria-hidden="true"><i className="lk-post-lines" /><i className="lk-post-grain" /></span>
    </>
  )
}

function Panel({ theme, i, state, dragX, dragging }: {
  theme: WidgetTheme
  i: number
  state: WidgetState
  dragX: number
  dragging: boolean
}) {
  const { t } = useTranslation()
  const day = theme === 'light'
  return (
    <div className={`lk-post is-${day ? 'day' : 'night'}`}>
      <PosterArt night={!day} />
      <div className="lk-post-in">
        <div className="lk-post-top">
          <span>{t(day ? 'link.out.pDay' : 'link.out.pNight')}</span>
          <span className="lk-post-size">{SLIDES[i].size}</span>
        </div>
        <div className="lk-post-stage">
          <div className="lk-post-view">
            <div className="lk-post-rail" style={{
              transform: `translate3d(calc(${-i * 100}% + ${dragX}px), 0, 0)`,
              transition: dragging ? 'none' : undefined,
            }}>
              {SLIDES.map((s, k) => (
                <div className="lk-post-slide" key={s.arrange} aria-hidden={k !== i}>
                  <figure><div className="lk-home-frame"><Stage width={390} height={844}><HomeScreen theme={theme} arrange={s.arrange} state={state} /></Stage></div></figure>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Specimen({ k, id, w, h }: { k: number; id: string; w: number; h: number }) {
  const { t } = useTranslation()
  const Body = id === 'wide' ? Widget4x2 : id === 'slim' ? Widget4x1 : Widget2x2
  return (
    <div className={`lk-spec is-${id}`}>
      <div className="lk-spec-head">
        <span className="lk-spec-idx">{String(k + 1).padStart(2, '0')}</span>
        <span className="lk-spec-name">{t(`link.out.sp${k + 1}n`)}</span>
        <span className="lk-spec-dim">{t(`link.out.sp${k + 1}d`)}</span>
      </div>
      <div className="lk-spec-pair">
        {(['light', 'dark'] as WidgetTheme[]).map((th) => (
          <figure className="lk-spec-item" key={th} style={{ maxWidth: w }}>
            <Stage width={w} height={h} className="lk-spec-frame"><Body theme={th} live /></Stage>
            <figcaption>{th === 'light' ? t('link.out.lightL') : t('link.out.darkL')}</figcaption>
          </figure>
        ))}
      </div>
      <p className="lk-spec-note">{t(`link.out.sp${k + 1}note`)}</p>
    </div>
  )
}

export default function OutOfAppSection() {
  const { t } = useTranslation()
  const car = useCarousel(SLIDES.length, 0)
  const { i, go, jump } = car
  const [state, setState] = useState<WidgetState>('live')
  const [theme, setTheme] = useState<WidgetTheme>('light')
  const slide = SLIDES[i]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setTimeout(() => setState((s) => (s === 'live' ? 'idle' : 'live')), state === 'live' ? LIVE_MS : IDLE_MS)
    return () => window.clearTimeout(id)
  }, [state])

  return (
    <section className="lk-sec lkx-section lkx-objects" id="outofapp">
      <div className="lk-wrap">
        <div className="lk-head lkx-head" data-reveal>
          <span className="lk-kicker">{t('link.out.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.out.title')}</h2>
          <p className="lk-lede">{t('link.out.body')}</p>
        </div>

        <div className="lkx-theme-switch" role="group" aria-label={t('link.out.wTitle')}>
          {(['light', 'dark'] as WidgetTheme[]).map((th) => (
            <button key={th} type="button" className={theme === th ? 'on' : ''} aria-pressed={theme === th} onClick={() => setTheme(th)}>
              {t(th === 'light' ? 'link.out.day' : 'link.out.night')}
            </button>
          ))}
        </div>

        <div className={`lk-poster${car.dragging ? ' is-dragging' : ''}`} data-theme={theme} data-reveal ref={car.host} {...car.hostProps}>
          <Panel theme="light" i={i} state={state} dragX={car.dragX} dragging={car.dragging} />
          <Panel theme="dark" i={i} state={state} dragX={car.dragX} dragging={car.dragging} />
          <button type="button" className="lk-post-arrow is-prev" onClick={() => go(-1)} aria-label={t('link.out.prevA')}><ChevronIcon size={18} className="lk-wcar-chev" /></button>
          <button type="button" className="lk-post-arrow is-next" onClick={() => go(1)} aria-label={t('link.out.nextA')}><ChevronIcon size={18} className="lk-wcar-chev" /></button>
        </div>

        <div className={`lk-wcar-state is-${state}`} aria-hidden="true">
          <span key={state} className="lk-wcar-statein"><i />{t(state === 'live' ? 'link.out.stateLive' : 'link.out.stateIdle')}</span>
        </div>

        <div className="lk-wcar-foot lkx-object-foot" data-reveal>
          <div className="lk-wcar-lead">
            <div key={slide.arrange}>
              <span className="lk-wcar-count">{String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
              <h3 className="lk-wcar-name">{t(`link.out.${slide.copy}k`)}</h3>
              <p className="lk-wcar-d">{t(`link.out.${slide.copy}d`)}</p>
            </div>
          </div>
          <div className="lk-wcar-nav">
            <button type="button" className="lk-wcar-arrow is-inline is-prev" onClick={() => go(-1)} aria-label={t('link.out.prevA')}><ChevronIcon size={16} className="lk-wcar-chev" /></button>
            <span className="lk-wcar-dots">
              {SLIDES.map((s, k) => <button key={s.arrange} type="button" className={k === i ? 'on' : ''} onClick={() => jump(k)} aria-label={t(`link.out.${s.copy}k`)} aria-current={k === i} />)}
            </span>
            <button type="button" className="lk-wcar-arrow is-inline is-next" onClick={() => go(1)} aria-label={t('link.out.nextA')}><ChevronIcon size={16} className="lk-wcar-chev" /></button>
          </div>
        </div>

        <details className="lkx-details lkx-widget-details" data-reveal>
          <summary>{t('link.out.sheetK')}</summary>
          <p className="lkx-details-intro">{t('link.out.sheetD')}</p>
          <div className="lk-sheet">
            {SPECIMENS.map((s, k) => <Specimen key={s.id} k={k} id={s.id} w={s.w} h={s.h} />)}
            <p className="lk-sheet-note">{t('link.out.sheetNote')}</p>
          </div>
        </details>
      </div>
    </section>
  )
}
