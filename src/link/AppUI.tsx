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
  GripIcon,
  MenuIcon,
  PauseIcon,
  SkipIcon,
  TimerNavIcon,
  WifiGlyph,
} from './icons'

/**
 * Faithful DOM recreations of the ROTA Link screens, built from the Compose
 * source (1 dp = 1 px at a 390 dp wide phone). Everything here is measured to
 * the app's real layout constants — see the comment above each screen.
 */

const TABS = ['TIMER', 'RECIPES', 'DEVICE'] as const

function Clock({ sec, size }: { sec: number; size: number }) {
  return (
    <div className="ui-clock" style={{ fontSize: size }}>
      {fmtClock(sec)}
    </div>
  )
}

/** Status bar + punch hole: the app runs edge-to-edge, so shots include it. */
function StatusBar({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
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
function AppHeader({ title, sub }: { title: string; sub: string }) {
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
  const icons = { TIMER: TimerNavIcon, RECIPES: BeakerNavIcon, DEVICE: DeviceNavIcon }
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
export function LandscapeTimer({ linked, offset = 219 }: { linked: boolean; offset?: number }) {
  const { t } = useTranslation()
  const clock = useProcessClock(C41.steps, offset)
  const R = 104.5
  const C = 2 * Math.PI * R
  const next1 = C41.steps[clock.stage + 1]
  const next2 = C41.steps[clock.stage + 2]
  return (
    <div className="ui ui-landscape">
      <div className="ls-top">
        <div className="ls-brand">
          <span className="ls-brand-a">ROTA</span>
          <span className="ls-brand-b">LINK</span>
        </div>
        <div className="ls-title">
          <span>{C41.name}</span>
          <i />
          <span className="ls-title-meta">
            {C41.temperatureC.toFixed(1)}°C&nbsp;&nbsp;·&nbsp;&nbsp;{C41.rpm} RPM
          </span>
        </div>
        <div className="ls-right">
          <div className="ls-badge">
            <i className={linked ? 'on' : ''} />
            {linked ? t('link.app.connected') : t('link.app.timerOnly')}
          </div>
          <span className="ls-collapse">
            <CollapseIcon size={18} />
          </span>
        </div>
      </div>

      <div className="ls-mid">
        <div className="ls-left">
          <div className="ls-info">
            <div className="ls-label">{t('link.app.targetTemp')}</div>
            <div className="ls-value">{C41.temperatureC.toFixed(1)}°C</div>
          </div>
          <div className="ls-rule" />
          <div className="ls-info">
            <div className="ls-label">{t('link.app.rotationSpeed')}</div>
            <div className="ls-value">{C41.rpm} RPM</div>
          </div>
          <div className="ls-rule" />
          <div className="ls-info">
            <div className="ls-label">{t('link.app.rotationDir')}</div>
            <div className="ls-value">—</div>
          </div>
        </div>

        <div className="ls-center">
          <div className="ls-ring">
            <svg viewBox="0 0 212 212" width="212" height="212" aria-hidden="true">
              <circle cx="106" cy="106" r={R} stroke="#3A3B36" strokeWidth="3" fill="none" />
              <circle
                cx="106"
                cy="106"
                r={R}
                stroke="#D7BC7D"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(C * clock.stageFraction).toFixed(2)} ${C.toFixed(2)}`}
                transform="rotate(-90 106 106)"
              />
              <circle
                cx={106 + R * Math.cos((clock.stageFraction * 360 - 90) * (Math.PI / 180))}
                cy={106 + R * Math.sin((clock.stageFraction * 360 - 90) * (Math.PI / 180))}
                r="4"
                fill="#D7BC7D"
              />
            </svg>
            <div className="ls-ring-inner">
              <div className="ls-cur-label">{t('link.app.currentStep')}</div>
              <div className="ls-cur-name">{C41.steps[clock.stage].title}</div>
              <Clock sec={clock.remaining} size={62} />
              <div className="ls-ring-rule" />
              <div className="ls-count">
                {clock.stage + 1} / {C41.steps.length}
              </div>
              <div className="ls-count-label">{t('link.app.stepsWord')}</div>
            </div>
          </div>
        </div>

        <div className="ls-rightcol">
          <div className="ls-label">{t('link.app.deviceStatus')}</div>
          <div className="ls-devstatus">
            <i className={linked ? 'on' : ''} />
            {linked ? 'ROTA Controller' : t('link.app.timerOnly')}
          </div>
          <div className="ls-rule" />
          <div className="ls-info">
            <div className="ls-label">{t('link.app.bathTemp')}</div>
            <div className="ls-value">—</div>
            <div className="ls-sub">{t('link.app.target', { v: C41.temperatureC.toFixed(1) })}</div>
          </div>
          <div className="ls-rule" />
          <div className="ls-info">
            <div className="ls-label">{t('link.app.rotationSpeed')}</div>
            <div className="ls-value">—</div>
            <div className="ls-sub">{t('link.app.actual')}</div>
          </div>
          <div className="ls-rule" />
          <div className="ls-info">
            <div className="ls-label">{t('link.app.rotationDir')}</div>
            <div className="ls-value">—</div>
          </div>
        </div>
      </div>

      <div className="ls-bottom">
        <div className="ls-next">
          <div className="ls-label">{t('link.app.nextSteps')}</div>
          <div className="ls-next-row">
            <div className="ls-next-item">
              <span className="ls-next-no">{String(clock.stage + 2).padStart(2, '0')}</span>
              <span>
                <b>{next1 ? next1.title : t('link.app.endOfProcess')}</b>
                <em>{next1 ? fmtClock(next1.sec) : '—'}</em>
              </span>
            </div>
            {next2 && (
              <>
                <span className="ls-next-sep" />
                <div className="ls-next-item">
                  <span className="ls-next-no">{String(clock.stage + 3).padStart(2, '0')}</span>
                  <span>
                    <b>{next2.title}</b>
                    <em>{fmtClock(next2.sec)}</em>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="ls-actions">
          <div className="ls-pause">
            <PauseIcon size={15} />
            <span>{t('link.app.pause')}</span>
          </div>
          <div className="ls-skip">
            <SkipIcon size={15} />
            <span>{t('link.app.skip')}</span>
          </div>
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

export { C41, totalSec }

