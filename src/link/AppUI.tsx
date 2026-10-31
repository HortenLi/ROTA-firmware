import { useTranslation } from 'react-i18next'
import { C41, CUSTOM_RECIPE, BUILTIN_RECIPES, fmtClock, minutesLabel, totalSec, type AppRecipe } from './appData'
import { useProcessClock } from './Stage'
import {
  BeakerNavIcon,
  BatteryGlyph,
  ChevronIcon,
  CollapseIcon,
  DeviceNavIcon,
  ExpandIcon,
  FilmLogNavIcon,
  GripIcon,
  MenuIcon,
  PauseIcon,
  PlayFillIcon,
  SkipIcon,
  SpeakerIcon,
  TimerNavIcon,
  WifiGlyph,
} from './icons'
import { href } from '../router'

/**
 * Faithful DOM recreations of the ROTA Link screens, built from the Compose
 * source (1 dp = 1 px at a 390 dp wide phone). Everything here is measured to
 * the app's real layout constants — see the comment above each screen.
 */

/**
 * Four tabs since v0.16 — Film Log sits between the timer and the device panel.
 * Order is copied from `MainActivity.TABS`: RECIPES · TIMER · FILM_LOG · DEVICE.
 */
const TABS = ['RECIPES', 'TIMER', 'FILM_LOG', 'DEVICE'] as const

function Clock({ sec, size }: { sec: number; size: number }) {
  return (
    <div className="ui-clock" style={{ fontSize: size }}>
      {fmtClock(sec)}
    </div>
  )
}

/** Status bar + punch hole: the app runs edge-to-edge, so shots include it. */
export function StatusBar({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <div className={`ui-status ui-status-${tone}`}>
      <span className="ui-status-time">09:41</span>
      <span className="ui-punch" aria-hidden="true" />
      <span className="ui-status-right">
        <WifiGlyph />
        <BatteryGlyph />
      </span>
    </div>
  )
}

/** RotaApp header (v0.13.1): brand ─ title stack ─ 40dp button, one 40dp row. */
export function AppHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="ui-head">
      <div className="ui-brand">
        <span className="ui-brand-a">ROTA</span>
        <span className="ui-brand-b">LINK</span>
      </div>
      <div className="ui-head-titles">
        <span className="ui-head-title">{title}</span>
        <span className="ui-head-sub">{sub}</span>
      </div>
      <div className="ui-head-btn">
        <MenuIcon size={19} />
      </div>
    </div>
  )
}

function LinkBadge({ linked, label }: { linked: boolean; label: string }) {
  return (
    <div className="ui-linkbadge">
      <i className={linked ? 'on' : ''} />
      <span>{label}</span>
    </div>
  )
}

/** Live values driven by the same clock for every mock on the page. */
export function useLiveTimer(offsetSec = 219) {
  return useProcessClock(C41.steps, offsetSec)
}

type TimerCardProps = {
  recipe: AppRecipe
  stage: number
  remaining: number
  totalFraction: number
  linked: boolean
  phaseLabel: string
}

/** TimerScreen B: dark panel, step counter, countdown, 3 px progress, footer. */
function TimerCard({ recipe, stage, remaining, totalFraction, linked, phaseLabel }: TimerCardProps) {
  const { t } = useTranslation()
  return (
    <div className="ui-card">
      <div className="ui-card-top">
        <span className="ui-step-count">
          {t('link.app.stepOf', { a: String(stage + 1).padStart(2, '0'), b: String(recipe.steps.length).padStart(2, '0') })}
        </span>
        <span className="ui-phase">{phaseLabel}</span>
        <span className="ui-expand">
          <ExpandIcon size={16} />
        </span>
      </div>
      <div className="ui-stage-title">{recipe.steps[stage].title.toUpperCase()}</div>
      <Clock sec={remaining} size={54} />
      <div className="ui-progress">
        <span style={{ width: `${(totalFraction * 100).toFixed(2)}%` }} />
      </div>
      <div className="ui-card-foot">
        <span>{t('link.app.totalProcess', { v: fmtClock(totalSec(recipe)) })}</span>
        <span>{t('link.app.tempTarget', { v: recipe.temperatureC.toFixed(1) })}</span>
      </div>
      {linked && (
        <>
          <div className="ui-card-rule" />
          <div className="ui-card-live">
            <div>
              <div className="ui-live-label">{t('link.app.bathTemp')}</div>
              <div className="ui-live-value">
                <span className="ui-dash">—</span>
                <em>{t('link.app.target', { v: recipe.temperatureC.toFixed(1) })}</em>
              </div>
            </div>
            <div className="ui-live-right">
              <div>
                <div className="ui-live-label">{t('link.app.rotation')}</div>
                <div className="ui-live-small">— RPM</div>
              </div>
              <div>
                <div className="ui-live-label">{t('link.app.direction')}</div>
                <div className="ui-live-small">—</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function UpcomingRow({ recipe, stage }: { recipe: AppRecipe; stage: number }) {
  const { t } = useTranslation()
  const a = recipe.steps[stage + 1]
  const b = recipe.steps[stage + 2]
  return (
    <div className="ui-upcoming">
      <div className="ui-upcard">
        <div className="ui-up-label">{a ? t('link.app.nextN', { n: String(stage + 2).padStart(2, '0') }) : t('link.app.next')}</div>
        <div className="ui-up-name">{a ? a.title : t('link.app.processComplete')}</div>
        <div className="ui-up-time brass">{a ? fmtClock(a.sec) : '—'}</div>
        <div className="ui-up-desc">{t('link.app.nextStage')}</div>
      </div>
      <div className="ui-upcard">
        <div className="ui-up-label">{b ? t('link.app.upnextN', { n: String(stage + 3).padStart(2, '0') }) : t('link.app.upnext')}</div>
        <div className="ui-up-name">{b ? b.title : t('link.app.endOfProcess')}</div>
        <div className="ui-up-time">{b ? fmtClock(b.sec) : '—'}</div>
        <div className="ui-up-desc">{t('link.app.upcoming')}</div>
      </div>
    </div>
  )
}

function Controls() {
  const { t } = useTranslation()
  return (
    <div className="ui-controls">
      <div className="ui-ctl ui-ctl-primary">
        <PauseIcon size={17} />
        <span>{t('link.app.pause')}</span>
      </div>
      <div className="ui-ctl">
        <SkipIcon size={17} />
        <span>{t('link.app.skip')}</span>
      </div>
    </div>
  )
}

function ProcessOverview({ recipe, stage }: { recipe: AppRecipe; stage: number }) {
  const { t } = useTranslation()
  return (
    <>
      <div className="ui-ov-head">
        <span>{t('link.app.overview')}</span>
        <span className="ui-ov-count">{t('link.app.stepsCount', { n: String(recipe.steps.length).padStart(2, '0') })}</span>
      </div>
      <div className="ui-ov-panel">
        {recipe.steps.map((s, i) => {
          const done = i < stage
          const current = i === stage
          return (
            <div className="ui-ov-row" key={s.title + i}>
              <span className={`ui-ov-idx${current ? ' cur' : ''}${done ? ' done' : ''}`}>
                {done ? '✓' : String(i + 1).padStart(2, '0')}
              </span>
              <span className="ui-ov-text">
                <span className={current ? 'cur' : ''}>{s.title}</span>
                <em>{done ? t('link.app.completed') : current ? t('link.app.inProgress') : t('link.app.upcoming')}</em>
              </span>
              <span className="ui-ov-dur">{fmtClock(current ? recipe.steps[i].sec : s.sec)}</span>
            </div>
          )
        })}
      </div>
    </>
  )
}

function TabBar({ active = 'TIMER' }: { active?: string }) {
  const { t } = useTranslation()
  const icons = {
    RECIPES: BeakerNavIcon,
    TIMER: TimerNavIcon,
    FILM_LOG: FilmLogNavIcon,
    DEVICE: DeviceNavIcon,
  }
  return (
    <div className="ui-tabbar">
      {TABS.map((tab) => {
        const Icon = icons[tab]
        const on = tab === active
        return (
          <div className={`ui-tab${on ? ' on' : ''}`} key={tab}>
            <span className="ui-tab-icon">
              <Icon />
              {on && <i />}
            </span>
            <span>{t(`link.app.tab${tab}`)}</span>
          </div>
        )
      })}
    </div>
  )
}

/** Full portrait home screen — TimerScreen, top to bottom. */
export function TimerHome({ linked, offset = 219 }: { linked: boolean; offset?: number }) {
  const { t } = useTranslation()
  const clock = useProcessClock(C41.steps, offset)
  return (
    <div className="ui ui-home">
      <StatusBar />
      <AppHeader title={t('link.app.tabTIMER')} sub={t('link.app.timerSub')} />
      <div className="ui-body">
        <div className="ui-identity">
          <div>
            <div className="ui-recipe-name">{C41.name}</div>
            <div className="ui-recipe-meta">
              {t('link.app.recipeMeta', {
                process: C41.process,
                n: C41.steps.length,
                total: fmtClock(totalSec(C41)),
              })}
            </div>
          </div>
          <LinkBadge linked={linked} label={linked ? t('link.app.connected') : t('link.app.timerOnly')} />
        </div>
        <TimerCard
          recipe={C41}
          stage={clock.stage}
          remaining={clock.remaining}
          totalFraction={clock.totalFraction}
          linked={linked}
          phaseLabel={t('link.app.running')}
        />
        <UpcomingRow recipe={C41} stage={clock.stage} />
        <Controls />
        <ProcessOverview recipe={C41} stage={clock.stage} />
      </div>
      <TabBar />
    </div>
  )
}

/**
 * Landscape full-screen timer (TimerFullscreenScreen): 150 dp settings column,
 * 212 dp ring, 170 dp device column, next-steps bar with PAUSE / SKIP.
 */
/**
 * Landscape full-screen timer (v0.16). The ring is gone: the countdown *is* the
 * instrument — one enormous number, the step above it, duration and percentage
 * below, and a full-process bar that turns green behind you and vermilion once
 * the time is spent. The bottom bar carries the primary control, a long-press
 * SKIP, the next three steps as cards, and ABORT on the far edge.
 *
 * Geometry from `TimerFullscreen.kt`: 844 × 390 dp, 26/12 dp page padding,
 * 38 dp top bar, clock column 3.2 against the instrument column 1, 66 dp bar.
 */
export function LandscapeTimer({ linked, offset = 219, recipe = C41, onCollapse, running = true, onStart, tapHint }: {
  linked: boolean
  offset?: number
  /** the run on screen — a different recipe resets every read on the page */
  recipe?: AppRecipe
  onCollapse?: () => void
  /** false = the run has not been started yet (the clock holds on the first step) */
  running?: boolean
  onStart?: () => void
  /** drew a tap ring on the primary control, for the launch-sequence demo */
  tapHint?: boolean
}) {
  const { t } = useTranslation()
  const clock = useProcessClock(recipe.steps, offset, running)
  const total = totalSec(recipe)
  const played = 100 * clock.totalFraction
  const done = 100 * (recipe.steps.slice(0, clock.stage).reduce((a, s) => a + s.sec, 0) / total)
  const next = [1, 2, 3].map((i) => recipe.steps[clock.stage + i]).filter(Boolean)
  // cumulative stage boundaries as a percentage of the whole process
  const stageSeams = recipe.steps.slice(0, -1).map((_, i) => {
    const acc = recipe.steps.slice(0, i + 1).reduce((a, s) => a + s.sec, 0)
    return (100 * acc) / total
  })

  return (
    <div className="ui ui-landscape">
      <div className="ls-top">
        <div className="ls-brand">
          <span className="ls-brand-a">ROTA</span>
          <span className="ls-brand-b">LINK</span>
        </div>
        <div className="ls-topright">
          <span className="ls-recipe">{recipe.name}</span>
          <i className="ls-vrule" aria-hidden="true" />
          <span className="ls-meta">
            {recipe.temperatureC.toFixed(1)}°C&nbsp;&nbsp;·&nbsp;&nbsp;{recipe.rpm} RPM
          </span>
          <span className="ls-mute">
            <SpeakerIcon size={16} on />
          </span>
          <span className="ls-badge">
            <i className={linked ? 'on' : ''} />
            {linked ? t('link.app.connected') : t('link.app.timerOnly')}
          </span>
          {onCollapse ? (
            <button type="button" className="ls-collapse is-btn" onClick={onCollapse} tabIndex={-1}>
              <CollapseIcon size={18} />
            </button>
          ) : (
            <span className="ls-collapse">
              <CollapseIcon size={18} />
            </span>
          )}
        </div>
      </div>

      <div className="ls-mid">
        <div className="ls-clock">
          <div className="ls-cur">
            <span className="ls-cur-name">{recipe.steps[clock.stage].title}</span>
            <span className="ls-stepcount">
              {t('link.app.stepOf', {
                a: String(clock.stage + 1).padStart(2, '0'),
                b: String(recipe.steps.length).padStart(2, '0'),
              })}
            </span>
          </div>
          {/* The app draws the clock as two text runs plus a hand-placed colon:
              Jost's own colon sits on the baseline and at 240 px it drops below
              the optical centre of the glyphs. Two dots at ±0.13 em reproduce
              DigitDisplay exactly. */}
          <div className="ls-digits">
            <span className="ls-num">{fmtClock(clock.remaining).slice(0, 2)}</span>
            <span className="ls-colon" aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="ls-num">{fmtClock(clock.remaining).slice(3)}</span>
          </div>
          <div className="ls-reads">
            <span>
              <i>{t('link.notif.duration')}</i>
              <b>{fmtClock(total)}</b>
            </span>
            <span className="ls-pct">{Math.round(played)}%</span>
          </div>
          <div className="ls-bar">
            <span className="ls-bar-done" style={{ width: `${done.toFixed(2)}%` }} />
            <span className="ls-bar-play" style={{ width: `${(played - done).toFixed(2)}%` }} />
            {/* stage seams — only ahead of the playhead, like the app's clipped draw */}
            {stageSeams.map((p) =>
              p > played + 0.4 ? (
                <i className="ls-bar-tick" key={p} style={{ left: `${p.toFixed(2)}%` }} />
              ) : null,
            )}
          </div>
        </div>

        <span className="ls-divider" aria-hidden="true" />

        <div className="ls-side">
          <div className="ls-side-eyebrow">{t('link.app.deviceStatus')}</div>
          <div className="ls-devstatus">
            <i className={linked ? 'on' : ''} />
            {linked ? 'ROTA Controller' : t('link.app.timerOnly')}
          </div>
          <span className="ls-side-rule" aria-hidden="true" />

          <div className="ls-side-eyebrow">{t('link.app.bathTemp')}</div>
          <div className="ls-side-value">
            <b>—</b>
            <em>/</em>
            <span>{recipe.temperatureC.toFixed(1)}°C</span>
          </div>
          <span className="ls-side-rule" aria-hidden="true" />

          <div className="ls-side-eyebrow">{t('link.app.rotation')}</div>
          <div className="ls-side-value">
            <b>{recipe.rpm}</b>
            <span className="ls-unit">RPM</span>
          </div>
        </div>
      </div>

      <span className="ls-footrule" aria-hidden="true" />

      <div className="ls-bottom">
        <button
          type="button"
          className={`ls-pause${running ? '' : ' is-start'}`}
          onClick={onStart}
          tabIndex={onStart ? 0 : -1}
        >
          {running ? <PauseIcon size={14} /> : <PlayFillIcon size={11} />}
          {running ? t('link.app.pause') : t('link.app.start')}
          {tapHint && <span className="ls-tap" aria-hidden="true" />}
        </button>
        <span className="ls-skip">
          <SkipIcon size={14} />
          {t('link.app.skip')}
        </span>

        <span className="ls-vline" aria-hidden="true" />

        <div className="ls-cards">
          {next.map((s, i) => (
            <div className="ls-card" key={s.title}>
              <div className="ls-card-top">
                <span>
                  {String(clock.stage + 2 + i).padStart(2, '0')} / {t('link.app.next')}
                </span>
                <span className="ls-card-dur">{fmtClock(s.sec)}</span>
              </div>
              <div className="ls-card-name">{s.title}</div>
            </div>
          ))}
        </div>

        <span className="ls-vline" aria-hidden="true" />

        <span className="ls-abort">{t('link.app.abort')}</span>
      </div>
    </div>
  )
}

/**
 * RecipesFullscreenScreen — the screen the app opens on when the phone is held
 * sideways. Geometry is a literal transcription of the Compose source (26/12
 * page padding, 44 dp exit target, 250 dp VerticalPager, 30 dp gutter, then the
 * card list), and the state is lifted so the demo can actually be swiped: the
 * settled page *is* the loaded run, exactly as `snapshotFlow { settledPage }`
 * drives `vm.timer.load()` in the app.
 */
export function LandscapeRecipes({
  recipes = BUILTIN_RECIPES,
  index,
  onPick,
  onStart,
  onExit,
  swipeHint,
}: {
  recipes?: AppRecipe[]
  index: number
  onPick?: (i: number) => void
  onStart?: () => void
  onExit?: () => void
  /** drew the gesture the screen is asking for, for the launch-sequence demo */
  swipeHint?: 'up' | 'tap' | null
}) {
  const { t } = useTranslation()
  // LazyColumn: the focused card is scrolled into view, four rows fill the pane
  const start = Math.max(0, Math.min(index, recipes.length - 4))
  const pageStyle = { '--i': index } as React.CSSProperties

  return (
    <div className="ui ui-landscape ui-lrec">
      <div className="lr-top">
        <div className="ls-brand">
          <span className="ls-brand-a">ROTA</span>
          <span className="ls-brand-b">LINK</span>
        </div>
        <button
          type="button"
          className="ls-exit"
          onClick={onExit}
          aria-label={t('link.flow.exitA')}
          tabIndex={-1}
        >
          <CollapseIcon size={18} />
        </button>
      </div>

      <div className="lr-body">
        {/* left column — the VerticalPager: drag up or down to change recipe */}
        <div className="lr-pager">
          <div className="lr-pager-track" style={pageStyle}>
            {recipes.map((r, i) => (
              <div className={`lr-page${i === index ? ' on' : ''}`} key={r.slot}>
                <span className="lr-k">{t('link.app.recipeLabel')}</span>
                <span className="lr-name">{r.name}</span>
                <span className="lr-note">{t(`link.flow.note${r.slot}`)}</span>
                <i className="lr-rule" aria-hidden="true" />
                <div className="lr-reads">
                  <div>
                    <span>{t('link.app.temperature')}</span>
                    <b>{r.temperatureC.toFixed(0)}°C</b>
                  </div>
                  <div className="is-wide">
                    <span>{t('link.app.rotationSpeed')}</span>
                    <b>{r.rpm} RPM</b>
                  </div>
                  <div className="is-narrow">
                    <span>{t('link.app.stepsWord')}</span>
                    <b>{String(r.steps.length).padStart(2, '0')}</b>
                  </div>
                </div>
                <i className="lr-rule" aria-hidden="true" />
                <div className="lr-acts">
                  <span className="lr-btn">{t('link.app.edit')}</span>
                  <button
                    type="button"
                    className="lr-btn is-play"
                    onClick={onStart}
                    tabIndex={i === index ? 0 : -1}
                  >
                    <PlayFillIcon size={9} />
                    {t('link.app.start')}
                    {swipeHint === 'tap' && i === index && (
                      <span className="lr-tap" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <span className="lr-tip">
                  <span className="lr-ud" aria-hidden="true">
                    <ChevronIcon size={10} up />
                    <ChevronIcon size={10} />
                  </span>
                  {t('link.flow.tip1')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* right column — the card list; tapping a card moves the pager */}
        <div className="lr-col">
          <span className="lr-k is-strong">{t('link.app.tabRECIPES')}</span>
          <div className="lr-cards">
            <div
              className="lr-cards-in"
              style={{ transform: `translateY(${-start * 66}px)` }}
            >
              {recipes.map((r, i) => (
                <button
                  type="button"
                  key={r.slot}
                  className={`lr-card${i === index ? ' on' : ''}`}
                  onClick={() => onPick?.(i)}
                >
                  <span className="lr-no">{String(r.slot).padStart(2, '0')}</span>
                  <span className="lr-cardtxt">
                    <b>{r.name}</b>
                    <em>
                      {t('link.app.metaLine', {
                        n: r.steps.length,
                        t: r.temperatureC.toFixed(0),
                        r: r.rpm,
                      })}
                    </em>
                  </span>
                  <span className="lr-dur">{fmtClock(totalSec(r))}</span>
                  <span className="lr-chev">
                    <ChevronIcon size={17} />
                  </span>
                </button>
              ))}
            </div>
          </div>
          <span className="lr-tip">{t('link.flow.tip2')}</span>
        </div>
      </div>
    </div>
  )
}

/** RecipesScreen list: built-in 01–05 as dark row cards with sync badges. */
export function RecipeListPanel({ inUseSlot = 2 }: { inUseSlot?: number }) {
  const { t } = useTranslation()
  return (
    <div className="ui ui-sheet">
      <div className="ui-sync">
        <div className="ui-sync-top">
          <span>{t('link.app.draftsOnly')}</span>
          <span className="ui-sync-time">{t('link.app.neverSynced')}</span>
        </div>
        <div className="ui-sync-actions">
          <span className="ui-btn-solid">{t('link.app.readAll')}</span>
          <span className="ui-btn-light">{t('link.app.newRecipe')}</span>
        </div>
        <div className="ui-sync-note">{t('link.app.syncNotLinked')}</div>
      </div>

      <div className="ui-section-label">{t('link.app.builtin')}</div>
      {BUILTIN_RECIPES.map((r) => (
        <div className="ui-row" key={r.slot}>
          <span className="ui-row-no">{String(r.slot).padStart(2, '0')}</span>
          <span className="ui-row-main">
            <span className="ui-row-name">{r.name}</span>
            <span className="ui-row-meta">
              {r.steps.length} {t('link.app.stepsWord')} · {minutesLabel(totalSec(r))} {t('link.app.minWord')} ·{' '}
              {r.temperatureC.toFixed(1)} °C · {r.rpm} RPM
            </span>
            <span className="ui-row-note">{r.note}</span>
          </span>
          <span className="ui-badge">{t('link.app.local')}</span>
          {r.slot === inUseSlot ? (
            <span className="ui-row-inuse">✓ {t('link.app.inUse')}</span>
          ) : (
            <span className="ui-row-edit">{t('link.app.edit')}</span>
          )}
        </div>
      ))}
      <div className="ui-section-label gap">{t('link.app.custom')}</div>
      <div className="ui-row">
        <span className="ui-row-no">06</span>
        <span className="ui-row-main">
          <span className="ui-row-name">{CUSTOM_RECIPE.name}</span>
          <span className="ui-row-meta">
            {CUSTOM_RECIPE.steps.length} {t('link.app.stepsWord')} · {minutesLabel(totalSec(CUSTOM_RECIPE))}{' '}
            {t('link.app.minWord')} · {CUSTOM_RECIPE.temperatureC.toFixed(1)} °C · {CUSTOM_RECIPE.rpm} RPM
          </span>
          <span className="ui-row-note dim">{CUSTOM_RECIPE.note}</span>
        </span>
        <span className="ui-badge">{t('link.app.local')}</span>
        <span className="ui-row-edit">{t('link.app.edit')}</span>
      </div>
      <div className="ui-row empty">
        <span className="ui-row-no">07</span>
        <span className="ui-row-main">
          <span className="ui-row-name empty">{t('link.app.emptySlot')}</span>
          <span className="ui-row-meta dim">{t('link.app.tapToCreate')}</span>
        </span>
      </div>
    </div>
  )
}

/**
 * Portrait home — what you see when the app opens (RotaApp / RecipesScreen):
 * status bar, the persistent header, the scrolling recipe sheet, the tab bar.
 * The sheet alone is a plate; inside this shell it reads as the phone.
 */
export function RecipeHome({ inUseSlot = 2 }: { inUseSlot?: number }) {
  const { t } = useTranslation()
  return (
    <div className="ui ui-home ui-rechome">
      <StatusBar />
      <AppHeader title={t('link.app.tabRECIPES')} sub={t('link.app.recipesSub')} />
      <div className="ui-rechome-body">
        <RecipeListPanel inUseSlot={inUseSlot} />
      </div>
      <TabBar active="RECIPES" />
    </div>
  )
}

/** RecipeEditor: per-recipe temp/rpm, dark step cards with MM:SS and grip. */
export function RecipeEditorPanel() {
  const { t } = useTranslation()
  const r = CUSTOM_RECIPE
  return (
    <div className="ui ui-sheet">
      <div className="ui-ed-head">
        <span className="ui-eyebrow">{t('link.app.editSlot', { slot: '06' })}</span>
        <span className="ui-badge">{t('link.app.local')}</span>
      </div>
      <div className="ui-ed-title">{r.name}</div>

      <div className="ui-field">
        <span>{t('link.app.noteField')}</span>
        <div className="ui-input">{r.note}</div>
      </div>

      <div className="ui-field-2">
        <div className="ui-field">
          <span>{t('link.app.tempField')}</span>
          <div className="ui-input">{r.temperatureC.toFixed(1)}</div>
        </div>
        <div className="ui-field">
          <span>{t('link.app.rpmField')}</span>
          <div className="ui-input">{r.rpm}</div>
        </div>
      </div>

      <div className="ui-steps-head">
        <span className="ui-eyebrow">{t('link.app.processSteps')}</span>
        <span className="ui-steps-count">
          {String(r.steps.length).padStart(2, '0')} / 13 {t('link.app.stepsWord')}
        </span>
      </div>

      {r.steps.map((s, i) => {
        const open = i === 1
        return (
          <div className={`ui-step${open ? ' open' : ''}`} key={s.title}>
            <div className="ui-step-sum">
              <span className="ui-step-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="ui-step-name">{s.title}</span>
              <span className="ui-step-dur">{fmtClock(s.sec)}</span>
              <span className="ui-step-chev">
                <ChevronIcon size={17} up={open} />
              </span>
              <span className="ui-step-grip">
                <GripIcon size={14} />
              </span>
            </div>
            {open && (
              <div className="ui-step-edit">
                <div className="ui-field-2">
                  <div className="ui-field dark">
                    <span>{t('link.app.stepTitle')}</span>
                    <div className="ui-dinput">{s.title}</div>
                  </div>
                  <div className="ui-field dark">
                    <span>{t('link.app.duration')}</span>
                    <div className="ui-dinput">
                      {fmtClock(s.sec)}
                      <em>{t('link.app.minSec')}</em>
                    </div>
                  </div>
                </div>
                <div className="ui-step-hint">{t('link.app.stepHint')}</div>
              </div>
            )}
          </div>
        )
      })}

      <div className="ui-btn-light wide">{t('link.app.addStep')}</div>
      <div className="ui-btn-solid wide">{t('link.app.saveDraft')}</div>
      <div className="ui-btn-light wide">{t('link.app.readDevice')}</div>
    </div>
  )
}

/**
 * Connected / standalone comparison card: the same timer card in both states.
 * Live telemetry is deliberately blank — the device link protocol does not
 * report it yet, and the app never guesses a value.
 */
export function ConnectCard({ linked }: { linked: boolean }) {
  const { t } = useTranslation()
  const clock = useProcessClock(C41.steps, 219)
  return (
    <div className="ui ui-compare">
      <div className="ui-identity">
        <div>
          <div className="ui-recipe-name">{C41.name}</div>
          <div className="ui-recipe-meta">
            {t('link.app.recipeMeta', {
              process: C41.process,
              n: C41.steps.length,
              total: fmtClock(totalSec(C41)),
            })}
          </div>
        </div>
        <LinkBadge linked={linked} label={linked ? t('link.app.connected') : t('link.app.timerOnly')} />
      </div>
      <TimerCard
        recipe={C41}
        stage={clock.stage}
        remaining={clock.remaining}
        totalFraction={clock.totalFraction}
        linked={linked}
        phaseLabel={t('link.app.running')}
      />
    </div>
  )
}

/** Phone body around a Stage — dark metal frame, generous corner radius. */
export function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`ph${className ? ` ${className}` : ''}`}>
      <div className="ph-body">{children}</div>
    </div>
  )
}

/** Zoomed detail plate A: the timer card alone, on the app's ink background. */
export function TimerCardPlate() {
  const { t } = useTranslation()
  const clock = useProcessClock(C41.steps, 219)
  return (
    <div className="plate plate-dark">
      <TimerCard
        recipe={C41}
        stage={clock.stage}
        remaining={clock.remaining}
        totalFraction={clock.totalFraction}
        linked={false}
        phaseLabel={t('link.app.running')}
      />
    </div>
  )
}

/** Zoomed detail plate B: the step list with done / running / upcoming states. */
export function OverviewPlate() {
  const clock = useProcessClock(C41.steps, 219)
  return (
    <div className="plate plate-deep">
      <ProcessOverview recipe={C41} stage={clock.stage} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Reminders — the three degrees, drawn the way the clock face draws them
// ---------------------------------------------------------------------------

/**
 * One reminder degree, on the same terms as the landscape clock face
 * (`TimerFullscreen.kt`, v0.16): the step name, the pill that *replaces* the
 * step counter while a reminder is live, the digits and their glow.
 *
 *   warm     Brass · breathing 1.5 s, never fully dark (0.55 → 1)
 *   approach Paper · flash 650 ms, one click per flash
 *   overtime RedSoft · steady, the digits settle at 0.62 and stay there
 *
 * The glow and the digits are two stacked layers with the same text, exactly
 * as in the app: the glow carries the animation, the glyphs stay opaque.
 */
export type AlertLevel = 'warm' | 'approach' | 'overtime'

export function AlertPlate({
  level,
  sec,
  pct,
  step = 1,
}: {
  level: AlertLevel
  sec: number
  pct: number
  step?: number
}) {
  const { t } = useTranslation()
  const label =
    level === 'overtime'
      ? t('link.remind.overtime')
      : `${t('link.remind.endingIn')} ${sec}s`
  const shown = fmtClock(sec)
  return (
    <div className={`ui-alert lv-${level}`}>
      <div className="ui-alert-top">
        <span className="ui-alert-step">{C41.steps[step].title}</span>
        <span className="ui-alert-pill">
          <i />
          {label}
        </span>
      </div>
      <div className="ui-alert-digits">
        <span className="ui-alert-glow" aria-hidden="true">
          {shown}
        </span>
        <span className="ui-alert-num">{shown}</span>
      </div>
      <div className="ui-alert-bar">
        <i style={{ width: `${Math.max(0, Math.min(100, pct)).toFixed(1)}%` }} />
      </div>
      <div className="ui-alert-foot">
        <span>{t('link.remind.duration')}</span>
        <span>{fmtClock(totalSec(C41))}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// The notification card (TimerNotifier, v0.16)
// ---------------------------------------------------------------------------

/**
 * The persistent notification, reproduced from the RemoteViews layouts:
 *
 *   name (18 bold) · step line · giant countdown
 *   6 dp stage bar (brass; the overtime layer turns the whole bar vermilion)
 *   expanded adds: elapsed / stage length, COMING UP (1–3 rows), status line
 *
 * No card background and no brand colours beyond the bar — that was a
 * deliberate v0.16.16 decision: the shade owns the surface, we only draw the
 * one brass line and the three semantic words (overtime / ending / complete).
 */
export function NotificationCard({
  expanded = false,
  theme = 'light',
}: {
  expanded?: boolean
  theme?: 'light' | 'dark'
}) {
  const { t } = useTranslation()
  const stageIdx = 1
  const stage = C41.steps[stageIdx]
  const remaining = 252
  const elapsed = stage.sec - remaining
  const pct = (elapsed / stage.sec) * 100
  const up = C41.steps.slice(stageIdx + 1, stageIdx + 4)

  return (
    <div className={`ui-notif is-${theme}${expanded ? ' is-expanded' : ''}`}>
      {expanded && (
        <span className="ui-notif-chev">
          <ChevronIcon size={15} up />
        </span>
      )}

      <div className="ui-notif-main">
        <img
          className="ui-notif-icon"
          src={href('/link/app-icon.png')}
          alt=""
          width={46}
          height={46}
          loading="lazy"
          decoding="async"
        />
        <div className="ui-notif-col">
          {expanded && <div className="ui-notif-app">{t('link.notif.app')}</div>}
          <div className="ui-notif-top">
            <div className="ui-notif-titles">
              <div className="ui-notif-name">{C41.name}</div>
              <div className="ui-notif-step">
                {stage.title} · {t('link.notif.step', { a: '02', b: '05' })}
              </div>
            </div>
            <div className="ui-notif-time">{fmtClock(remaining)}</div>
            {!expanded && (
              <span className="ui-notif-chev">
                <ChevronIcon size={15} />
              </span>
            )}
          </div>

          <div className="ui-notif-bar">
            <i style={{ width: `${pct.toFixed(1)}%` }} />
          </div>
        </div>
      </div>

      {expanded && (
        <>
          {/* the reads row sits under the bar, aligned with the text column */}
          <div className="ui-notif-body">
            <div className="ui-notif-reads">
              <span>{fmtClock(elapsed)}</span>
              <span>{fmtClock(stage.sec)}</span>
            </div>

            <div className="ui-notif-rule" />
            <div className="ui-notif-uphead">{t('link.notif.comingUp')}</div>
            {up.map((s, i) => (
              <div className="ui-notif-up" key={s.title}>
                <span className="ui-notif-upidx">{String(stageIdx + 2 + i).padStart(2, '0')}</span>
                <span className="ui-notif-uptitle">{s.title}</span>
                <span className="ui-notif-updur">{fmtClock(s.sec)}</span>
              </div>
            ))}

            <div className="ui-notif-rule" />
            <div className="ui-notif-status">
              <span className="ui-notif-state">{t('link.notif.running')}</span>
              <span className="ui-notif-duration">
                {t('link.notif.duration')} {fmtClock(totalSec(C41))}
              </span>
            </div>
          </div>

          <div className="ui-notif-acts">
            <span className="ui-notif-act">{t('link.notif.pause')}</span>
            <span className="ui-notif-act">{t('link.notif.skip')}</span>
            <span className="ui-notif-act">{t('link.notif.end')}</span>
          </div>
        </>
      )}
    </div>
  )
}

/** Muted speaker, as it appears in the landscape view while alerts are off. */
export function MutedSpeaker() {
  return (
    <span className="ui-mute">
      <SpeakerIcon size={16} on={false} />
    </span>
  )
}

export { C41, totalSec }


