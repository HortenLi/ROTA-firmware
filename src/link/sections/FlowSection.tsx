import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LandscapeRecipes, LandscapeTimer, RecipeHome } from '../AppUI'
import { BUILTIN_RECIPES } from '../appData'
import { Stage } from '../Stage'

/**
 * Section 01 — how it starts, played back instead of explained.
 *
 * One loop of the real thing: the phone is open in portrait, you turn it, the
 * recipe list is already there, two swipes pick a process, one more swipe
 * carries you into the timer, and the run begins. The screens are the actual
 * components — `LandscapeRecipes` is a transcription of `RecipesFullscreen`,
 * `LandscapeTimer` of `TimerFullscreen` — so what the loop shows is the app's
 * own motion, not an illustration of it.
 *
 * Everything below this section is a detail of a run that has already begun.
 */
export default function FlowSection() {
  const { t } = useTranslation()
  const recipes = BUILTIN_RECIPES.slice(0, 5)
  const [phase, setPhase] = useState(0)
  const [index, setIndex] = useState(0)
  const [view, setView] = useState<'recipes' | 'timer'>('recipes')
  const [running, setRunning] = useState(false)
  const live = useRef<HTMLDivElement | null>(null)

  const recipe = recipes[index]
  const hint = phase === 3 || phase === 4 ? 'up' : phase === 7 ? 'tap' : null

  const steps = [1, 2, 3].map((i) => ({
    n: String(i).padStart(2, '0'),
    k: t(`link.flow.s${i}k`),
    t: t(`link.flow.s${i}t`),
    d: t(`link.flow.s${i}d`),
  }))
  const portrait = [1, 2, 3].map((i) => t(`link.flow.p${i}`))

  // The loop. Timings are tuned to the CSS transitions: 0.85 s for the turn,
  // 0.42 s for the pager, 0.55 s for the rail — every beat lands after the
  // motion before it has settled.
  useEffect(() => {
    const el = live.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(8)
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
      const at = (ms: number, fn: () => void) => {
        timers.push(window.setTimeout(() => !dead && fn(), ms))
      }
      at(900, () => setPhase(1)) // turn the phone
      at(1750, () => setPhase(2)) // landscape, recipe 01
      at(2250, () => {
        setPhase(3)
        setIndex(1) // swipe up — C-41
      })
      at(2900, () => {
        setPhase(4)
        setIndex(2) // swipe up — ECN-2
      })
      at(3550, () => setPhase(5))
      at(3650, () => setView('timer')) // swipe left — the rail carries you over
      at(4300, () => setPhase(6)) // settled, not running yet
      at(4800, () => setPhase(7)) // the tap
      at(5600, () => {
        setPhase(8)
        setRunning(true)
      })
      at(8600, () => setPhase(9)) // fade out
      at(9300, play) // and again
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          play()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)

    return () => {
      dead = true
      io.disconnect()
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [])

  return (
    <section className="lk-sec lk-sec-flow" id="start">
      <div className="lk-wrap">
        <div className="lk-head" data-reveal>
          <span className="lk-kicker">{t('link.flow.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.flow.title')}</h2>
          <p className="lk-lede">{t('link.flow.body')}</p>
        </div>

        <figure className="lk-flow-demo" data-reveal>
          <div className="lk-screen lk-flow-live" data-phase={phase} ref={live}>
            <div className="fl-stage">
              {/* portrait: the app, already open */}
              <div className="fl-phone" aria-hidden={phase > 1}>
                <Stage width={390} height={844}>
                  <RecipeHome inUseSlot={2} />
                </Stage>
              </div>

              {/* landscape: recipes, then the run */}
              <div className="fl-land">
                <Stage width={844} height={390}>
                  <div
                    className="fl-rail"
                    style={view === 'timer' ? { transform: 'translateX(-844px)' } : undefined}
                  >
                    <div className="fl-pane">
                      <LandscapeRecipes
                        recipes={recipes}
                        index={index}
                        swipeHint={hint}
                        onPick={setIndex}
                        onStart={() => setView('timer')}
                        onExit={() => setView('recipes')}
                      />
                    </div>
                    <div className="fl-pane">
                      <LandscapeTimer
                        key={recipe.slot}
                        linked={false}
                        offset={0}
                        recipe={recipe}
                        running={running}
                        tapHint={phase === 7}
                        onStart={() => setRunning(true)}
                        onCollapse={() => setView('recipes')}
                      />
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

        <ol className="lk-flow-steps" data-reveal>
          {steps.map((s) => (
            <li key={s.n}>
              <span className="lk-flow-n">{s.n}</span>
              <span className="lk-flow-k">{s.k}</span>
              <h3 className="lk-flow-t">{s.t}</h3>
              <p className="lk-flow-d">{s.d}</p>
            </li>
          ))}
        </ol>

        <div className="lk-flow-p" data-reveal>
          <div className="lk-flow-pcopy">
            <span className="lk-kicker lk-kicker-brass">{t('link.flow.pk')}</span>
            <p className="lk-flow-pt">{t('link.flow.pt')}</p>
            <p className="lk-flow-pd">{t('link.flow.pd')}</p>
          </div>
          <ul className="lk-flow-chips">
            {portrait.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
