import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LandscapeRecipes, LandscapeTimer, RecipeHome, StatusBar } from '../AppUI'
import { BUILTIN_RECIPES } from '../appData'
import { href } from '../../router'
import { Stage } from '../Stage'

function PhoneHome({ tap }: { tap: boolean }) {
  return (
    <div className="fl-home">
      <StatusBar />
      <div className="fl-hclock">09:41</div>
      <div className="fl-hicons">
        <div className={`fl-hico is-app${tap ? ' is-press' : ''}`}>
          <span className="fl-hface">
            <img className="fl-himg" src={href('/link/app-icon.png')} alt="" decoding="sync" fetchPriority="high" />
          </span>
          <span className="fl-hname">ROTA LINK</span>
          {tap && <span className="fl-tap" aria-hidden="true" />}
        </div>
        <div className="fl-hico"><i className="fl-hglyph is-ring" /></div>
        <div className="fl-hico"><i className="fl-hglyph is-tri" /></div>
        <div className="fl-hico"><i className="fl-hglyph is-bars" /></div>
      </div>
      <div className="fl-hdots" aria-hidden="true"><i className="on" /><i /></div>
    </div>
  )
}

export default function FlowSection() {
  const { t } = useTranslation()
  const recipes = BUILTIN_RECIPES.slice(0, 5)
  const [phase, setPhase] = useState(0)
  const [index, setIndex] = useState(0)
  const [view, setView] = useState<'recipes' | 'timer'>('recipes')
  const [running, setRunning] = useState(false)
  const live = useRef<HTMLDivElement | null>(null)

  const recipe = recipes[index]
  const stage = phase <= 1 ? 'home' : phase <= 2 ? 'portrait' : 'land'
  const hint = phase === 4 || phase === 5 ? 'up' : null
  const steps = [1, 2, 3].map((i) => ({
    n: String(i).padStart(2, '0'),
    k: t(`link.flow.s${i}k`),
    t: t(`link.flow.s${i}t`),
    d: t(`link.flow.s${i}d`),
  }))
  const portrait = [1, 2, 3].map((i) => t(`link.flow.p${i}`))

  useEffect(() => {
    const el = live.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(9)
      setIndex(1)
      setView('timer')
      setRunning(true)
      return
    }
    let timers: number[] = []
    let dead = false
    const play = () => {
      timers.forEach((id) => window.clearTimeout(id))
      timers = []
      setPhase(0)
      setIndex(0)
      setView('recipes')
      setRunning(false)
      const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(() => !dead && fn(), ms))
      at(1500, () => setPhase(1))
      at(2100, () => setPhase(2))
      at(3300, () => setPhase(3))
      at(4300, () => setPhase(4))
      at(5600, () => { setPhase(5); setIndex(1) })
      at(7000, () => { setPhase(6); setIndex(2) })
      at(8400, () => { setPhase(7); setView('timer') })
      at(9200, () => setPhase(8))
      at(10100, () => { setPhase(9); setRunning(true) })
      at(13400, () => setPhase(10))
      at(14100, play)
    }
    const start = async () => {
      const icon = el.querySelector<HTMLImageElement>('.fl-himg')
      if (icon && !icon.complete) {
        try { await icon.decode() } catch { /* the loop can still start */ }
      }
      if (!dead) play()
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect()
        void start()
      }
    }, { threshold: 0.3 })
    io.observe(el)
    return () => {
      dead = true
      io.disconnect()
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  return (
    <section className="lk-sec lkx-section lkx-flow" id="start">
      <span id="app" className="lkx-anchor" aria-hidden="true" />
      <span id="recipes" className="lkx-anchor" aria-hidden="true" />
      <span id="workflow" className="lkx-anchor" aria-hidden="true" />
      <div className="lk-wrap">
        <div className="lk-head lkx-head" data-reveal>
          <span className="lk-kicker">{t('link.flow.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.flow.title')}</h2>
          <p className="lk-lede">{t('link.flow.body')}</p>
        </div>

        <figure className="lk-flow-demo lkx-flow-sequence">
          <div className="lk-screen lk-flow-live" data-phase={phase} data-stage={stage} data-fade={phase === 10} ref={live}>
            <div className="fl-stage">
              <div className="fl-phone" aria-hidden={stage === 'land'}>
                <Stage width={390} height={844}>
                  <div className="fl-screen">
                    <div className="fl-appwin" data-open={phase >= 2}><RecipeHome inUseSlot={2} /></div>
                    <div className="fl-homelayer" data-open={phase >= 2}><PhoneHome tap={phase === 1} /></div>
                  </div>
                </Stage>
              </div>
              <div className="fl-land">
                <Stage width={844} height={390}>
                  <div className="fl-rail" style={view === 'timer' ? { transform: 'translateX(-844px)' } : undefined}>
                    <div className="fl-pane">
                      <LandscapeRecipes recipes={recipes} index={index} swipeHint={hint} onPick={setIndex} onStart={() => setView('timer')} onExit={() => setView('recipes')} />
                    </div>
                    <div className="fl-pane">
                      <LandscapeTimer key={recipe.slot} linked={false} offset={0} recipe={recipe} running={running} tapHint={phase === 8} onStart={() => setRunning(true)} onCollapse={() => setView('recipes')} />
                    </div>
                  </div>
                </Stage>
              </div>
            </div>
          </div>
          <figcaption className="lk-figcap">
            <span className="lk-figcap-rule" aria-hidden="true" />
            <span>{t('link.flow.stageCap')}</span>
            <span className="lk-figcap-note">{t('link.flow.stageNote')}</span>
          </figcaption>
        </figure>

        <ol className="lk-flow-steps lkx-flow-steps" data-reveal>
          {steps.map((s) => (
            <li key={s.n}>
              <span className="lk-flow-n">{s.n}</span>
              <span className="lk-flow-k">{s.k}</span>
              <h3 className="lk-flow-t">{s.t}</h3>
              <p className="lk-flow-d">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="lk-flow-p lkx-flow-note" data-reveal>
          <div className="lk-flow-pcopy">
            <span className="lk-kicker lk-kicker-brass">{t('link.flow.pk')}</span>
            <p className="lk-flow-pt">{t('link.flow.pt')}</p>
            <p className="lk-flow-pd">{t('link.flow.pd')}</p>
          </div>
          <ul className="lk-flow-chips">{portrait.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>

        <details className="lkx-details" data-reveal>
          <summary>{t('link.flow.detailToggle')}</summary>
          <div className="lkx-details-grid">
            <p>{t('link.recipes.body')}</p>
            <p>{t('link.recipes.aside')}</p>
            <p>{t('link.timer.holdNote')}</p>
          </div>
        </details>
      </div>
    </section>
  )
}
