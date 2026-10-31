import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LandscapeRecipes, LandscapeTimer, RecipeHome, StatusBar } from '../AppUI'
import { BUILTIN_RECIPES } from '../appData'
import { href } from '../../router'
import { Stage } from '../Stage'

/**
 * The phone's own home screen, on the wall behind the app: wallpaper, clock,
 * a row of icons. Only the ROTA Link icon is named — the rest stay anonymous
 * shapes, because inventing other people's apps would be a lie.
 */
function PhoneHome({ tap }: { tap: boolean }) {
  return (
    <div className="fl-home">
      <StatusBar />
      <div className="fl-hclock">09:41</div>
      <div className="fl-hicons">
        <div className={`fl-hico is-app${tap ? ' is-press' : ''}`}>
          <span className="fl-hface">
            <img className="fl-himg" src={href('/link/app-icon.png')} alt="" />
          </span>
          <span className="fl-hname">ROTA LINK</span>
          {tap && <span className="fl-tap" aria-hidden="true" />}
        </div>
        <div className="fl-hico">
          <i className="fl-hglyph is-ring" />
        </div>
        <div className="fl-hico">
          <i className="fl-hglyph is-tri" />
        </div>
        <div className="fl-hico">
          <i className="fl-hglyph is-bars" />
        </div>
      </div>
      <div className="fl-hdots" aria-hidden="true">
        <i className="on" />
        <i />
      </div>
    </div>
  )
}

/**
 * Section 01 — how it starts, played back instead of explained.
 *
 * One loop of the real thing: the phone is asleep on its home screen, you tap
 * the app, it opens in portrait, you turn it on its side, two swipes pick a
 * process, one more swipe carries you into the timer, and the run begins. The
 * screens are the actual components — `LandscapeRecipes` is a transcription of
 * `RecipesFullscreen`, `LandscapeTimer` of `TimerFullscreen` — so what the loop
 * shows is the app's own motion, not an illustration of it.
 *
 * Nothing here is interactive on purpose: the point of the section is the pace
 * of the gesture, not a toy to poke at.
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
  // 0–1 home, 2 the app open in portrait, 3+ turned on its side
  const stage = phase <= 1 ? 'home' : phase <= 2 ? 'portrait' : 'land'
  const hint = phase === 4 || phase === 5 ? 'up' : null

  const steps = [1, 2, 3].map((i) => ({
    n: String(i).padStart(2, '0'),
    k: t(`link.flow.s${i}k`),
    t: t(`link.flow.s${i}t`),
    d: t(`link.flow.s${i}d`),
  }))
  const portrait = [1, 2, 3].map((i) => t(`link.flow.p${i}`))

  // The loop. Every beat is timed to land after the motion before it has
  // settled — 0.55 s for the app opening, 0.95 s for the turn, 0.42 s for the
  // pager, 0.55 s for the rail — plus about a second of quiet in between, so
  // you can see each gesture finish before the next one starts.
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
      const at = (ms: number, fn: () => void) => {
        timers.push(window.setTimeout(() => !dead && fn(), ms))
      }
      at(1500, () => setPhase(1)) // the tap lands on the icon
      at(2100, () => setPhase(2)) // the app opens, portrait
      at(3300, () => setPhase(3)) // turn it on its side
      at(4300, () => setPhase(4)) // landscape, recipe 01, settled
      at(5600, () => {
        setPhase(5)
        setIndex(1) // swipe up — C-41
      })
      at(7000, () => {
        setPhase(6)
        setIndex(2) // swipe up — ECN-2
      })
      at(8400, () => {
        setPhase(7)
        setView('timer') // swipe left — the rail carries you over
      })
      at(9200, () => setPhase(8)) // settled, not running; the tap is offered
      at(10100, () => {
        setPhase(9)
        setRunning(true)
      })
      at(13400, () => setPhase(10)) // fade out
      at(14100, play) // and again
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
          <div
            className="lk-screen lk-flow-live"
            data-phase={phase}
            data-stage={stage}
            data-fade={phase === 10}
            ref={live}
          >
            <div className="fl-stage">
              {/* portrait: home screen, then the app */}
              <div className="fl-phone" aria-hidden={stage === 'land'}>
                <Stage width={390} height={844}>
                  <div className="fl-screen">
                    <div className="fl-appwin" data-open={phase >= 2}>
                      <RecipeHome inUseSlot={2} />
                    </div>
                    <div className="fl-homelayer" data-open={phase >= 2}>
                      <PhoneHome tap={phase === 1} />
                    </div>
                  </div>
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
                        tapHint={phase === 8}
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
