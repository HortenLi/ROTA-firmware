import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { C41, fmtClock, totalSec } from './appData'
import { href } from '../router'
import { BatteryGlyph, PlayFillIcon, WifiGlyph } from './icons'

/**
 * The three home-screen widgets, transcribed from the app.
 *
 * Source of truth:
 *   rotaLink/app/src/main/res/layout/widget_4x2.xml / widget_4x1.xml / widget_2x2.xml
 *   rotaLink/app/src/main/java/com/rota/link/widget/WidgetArt.kt   (the bitmap ground)
 *   rotaLink/app/src/main/java/com/rota/link/widget/RotaWidget.kt  (what is bound to what)
 *   res/values{,-night}/colors.xml                                 (the two colour sets)
 *
 * Nothing here is invented. The corners are 19 dp, the 4×2 keeps its
 * 20 / 11 / 42 / 11 padding and 26 dp film rail, the labels stay at 10 sp, and
 * the illustration is the same 420 × 290 canvas as WidgetArt.sceneDay /
 * sceneNight, drawn with the same coordinates (sun at 258,104 r62; three
 * ridges; the dashed ring; the three "subtitle" rules; the palm).
 *
 * What differs from the app is only the *size*: these are drawn the way a
 * four-column launcher hands them out (358 dp wide, 174 dp tall). That is why
 * the collar labels look small beside the clock — the real card looks like
 * that too. Only the clock and the quote auto-size in the app; their sizes here
 * are picked to match what autoSize lands on at this width.
 */

export type WidgetTheme = 'light' | 'dark'

/** The illustration canvas — must stay identical to WidgetArt.VW / VH. */
const ART_W = 420
const ART_H = 290

/** Where the sun sits on that canvas; the 2×2 pins this line, not the middle. */
const SUN_CY = 110

type Size = 'wide' | 'slim' | 'square'

/** 358 × 174 / 358 × 74 / 174 × 174 — a 4-column launcher, two rows tall. */
const DIM: Record<Size, [number, number]> = {
  wide: [358, 174],
  slim: [358, 74],
  square: [174, 174],
}

/** WidgetSize.railDp — the film strip, hard-wired in all three layouts. */
const RAIL: Record<Size, number> = { wide: 26, slim: 22, square: 18 }

/* ------------------------------------------------------------------ *
 * the illustration (WidgetArt.sceneDay / sceneNight, same numbers)
 * ------------------------------------------------------------------ */

const DAY = {
  sun: '#D66B3F',
  ring: '#F2D6AA',
  ridgeBack: '#385C54',
  ridgeFront: '#172F2D',
  dune: '#C75C3B',
  stripe: '#F2EDE0',
  sprocket: '#F2F0E8',
  palm: '#111722',
}

const NIGHT = {
  skyTop: '#28233F',
  skyMid: '#713D69',
  skyLow: '#E16A70',
  sun: '#FF946B',
  stripe: '#FFD1A3',
  city: '#171B2A',
  window: '#F7B96E',
  neonPink: '#FF6C9D',
  neonTeal: '#6DE8E5',
  palm: '#111722',
}

function ridgeD(pts: number[]): string {
  let d = `M${pts[0]} ${pts[1]}`
  for (let i = 2; i < pts.length; i += 2) d += ` L${pts[i]} ${pts[i + 1]}`
  return `${d} L420 330 L${pts[0]} 330 Z`
}

/** WidgetArt.palm: one curved trunk + six quadratic fronds, neon-outlined at night. */
function palmPaths(x: number, baseY: number, topY: number) {
  const span = baseY - topY
  const trunk =
    `M${x - 7} ${baseY}` +
    ` C${x - 4} ${baseY - span * 0.5} ${x - 1} ${topY + span * 0.22} ${x - 2.5} ${topY}` +
    ` L${x + 3} ${topY}` +
    ` C${x + 5} ${topY + span * 0.22} ${x + 6} ${baseY - span * 0.5} ${x + 9} ${baseY} Z`
  const fronds: [number, number, number][] = [
    [-1, -0.55, 74],
    [-1, 0.1, 64],
    [-0.45, -1, 70],
    [0.5, -0.95, 64],
    [1, -0.35, 70],
    [1, 0.25, 60],
  ]
  const paths = fronds.map(([dx, dy, len]) =>
    `M${x} ${topY} Q${x + dx * len * 0.55} ${topY + dy * len * 0.85} ${x + dx * len} ${
      topY + dy * len * 0.4 + 12
    }`,
  )
  return { trunk, paths }
}

function Palm({
  x,
  baseY,
  topY,
  neon,
}: {
  x: number
  baseY: number
  topY: number
  neon?: string
}) {
  const { trunk, paths } = palmPaths(x, baseY, topY)
  return (
    <>
      <path d={trunk} fill={NIGHT.palm} />
      {paths.map((d) => (
        <path key={d} d={d} fill="none" stroke={NIGHT.palm} strokeWidth={7} strokeLinecap="round" />
      ))}
      {neon && (
        <>
          {paths.map((d) => (
            <path key={d} d={d} fill="none" stroke={neon} strokeWidth={2} strokeLinecap="round" />
          ))}
        </>
      )}
    </>
  )
}

/** The Manhattan skyline step path — same edge list as WidgetArt.city(). */
function cityD(): string {
  const e = [
    0, 130, 32, 148, 55, 108, 82, 172, 104, 132, 130, 159, 154, 96, 182, 178, 210, 136, 234, 171,
    260, 119, 285, 181, 310, 145, 335, 175, 360, 130, 389, 170, 420, 140,
  ]
  let d = `M0 290 L${e[0]} ${e[1]}`
  for (let i = 2; i < e.length; i += 2) {
    d += ` L${e[i]} ${e[i - 1]} L${e[i]} ${e[i + 1]}`
  }
  return `${d} L420 290 Z`
}

const CITY_WINDOWS = [
  60, 120, 70, 120, 60, 138, 70, 138, 160, 108, 170, 108, 160, 126, 170, 126, 267, 132, 278, 132,
  267, 150, 370, 143, 380, 143,
]

function Scene({ night, uid }: { night: boolean; uid: string }) {
  if (!night) {
    return (
      <>
        <circle cx={258} cy={104} r={62} fill={DAY.sun} />
        <circle
          cx={258}
          cy={104}
          r={74}
          fill="none"
          stroke={DAY.ring}
          strokeOpacity={0.78}
          strokeWidth={1.3}
          strokeDasharray="3 8"
        />
        <path
          d={ridgeD([0, 232, 66, 170, 112, 198, 188, 118, 244, 164, 296, 108, 352, 156, 420, 120])}
          fill={DAY.ridgeBack}
        />
        <path
          d={ridgeD([0, 262, 74, 216, 124, 240, 192, 182, 250, 228, 304, 182, 366, 218, 420, 242])}
          fill={DAY.ridgeFront}
        />
        <path
          d={ridgeD([0, 300, 196, 250, 232, 268, 262, 236, 318, 268, 366, 246, 420, 276])}
          fill={DAY.dune}
        />
        {/* three "subtitle" rules — the film-mark, and they hold the empty left side */}
        <g stroke={DAY.stripe} strokeOpacity={0.59} strokeWidth={2.4} strokeLinecap="round">
          <path d="M22 214H122" />
          <path d="M22 224H94" />
          <path d="M22 234H66" />
        </g>
        {/* three sprockets, echoing the rail */}
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={146 + i * 15}
            y={236}
            width={8}
            height={14}
            rx={2}
            fill={DAY.sprocket}
            fillOpacity={0.75}
          />
        ))}
        <Palm x={92} baseY={300} topY={116} />
      </>
    )
  }

  return (
    <>
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="290" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={NIGHT.skyTop} />
          <stop offset="0.52" stopColor={NIGHT.skyMid} />
          <stop offset="1" stopColor={NIGHT.skyLow} />
        </linearGradient>
      </defs>
      <rect width={ART_W} height={ART_H} fill={`url(#${uid}-sky)`} />
      <circle cx={270} cy={118} r={66} fill={NIGHT.sun} />
      <g stroke={NIGHT.stripe} strokeOpacity={0.59} strokeWidth={3}>
        <path d="M206 130H334" />
        <path d="M212 146H328" />
        <path d="M220 162H320" />
        <path d="M232 178H308" />
      </g>
      <path d={cityD()} fill={NIGHT.city} />
      {CITY_WINDOWS.reduce<JSX.Element[]>((acc, v, i) => {
        if (i % 2 === 0) {
          acc.push(
            <rect key={v} x={v} y={CITY_WINDOWS[i + 1]} width={5} height={8} fill={NIGHT.window} />,
          )
        }
        return acc
      }, [])}
      <Palm x={100} baseY={300} topY={104} neon={NIGHT.neonPink} />
      <Palm x={378} baseY={300} topY={158} neon={NIGHT.neonTeal} />
      <rect y={254} width={ART_W} height={36} fill={NIGHT.city} fillOpacity={0.86} />
      {/* glowLine: a few widening strokes under one crisp line */}
      <g stroke={NIGHT.neonPink}>
        <path d="M0 258H420" strokeWidth={14} strokeOpacity={0.34} />
        <path d="M0 258H420" strokeWidth={10} strokeOpacity={0.26} />
        <path d="M0 258H420" strokeWidth={6} strokeOpacity={0.17} />
        <path d="M0 258H420" strokeWidth={2} />
      </g>
    </>
  )
}

/* ------------------------------------------------------------------ *
 * the card shell: paper, art, halftone, scrim, film rail
 * ------------------------------------------------------------------ */

/** WidgetArt.artRect — where the illustration is allowed to live, per size. */
function artBox(size: Size) {
  const [w, h] = DIM[size]
  const rail = RAIL[size]
  if (size === 'wide') return { x: w * 0.38, y: 0, w: w - w * 0.38 - rail, h }
  if (size === 'square') return { x: 0, y: h * 0.62, w, h: h * 0.38 }
  return { x: w * 0.42, y: -h * 0.28, w: w - w * 0.42 - rail, h: h * 1.28 }
}

/** cover-fit, never stretched — and the 2×2 anchors on the sun, not the middle. */
function artFit(size: Size) {
  const box = artBox(size)
  const s = Math.max(box.w / ART_W, box.h / ART_H)
  const focusY = size === 'square' ? SUN_CY : ART_H / 2
  const anchor = size === 'square' ? 0.45 : 0.5
  return {
    box,
    s,
    left: box.x + (box.w - ART_W * s) / 2,
    top: box.y + anchor * box.h - focusY * s,
  }
}

/** WidgetArt.drawRail — holes are 46% of the strip, 1.3 tall, evenly spaced. */
function railHoles(size: Size) {
  const [w, h] = DIM[size]
  const railW = RAIL[size]
  const holeW = railW * 0.46
  const holeH = holeW * 1.3
  const count = Math.max(3, Math.floor(h / (holeH * 1.93)))
  const gap = (h - count * holeH) / (count + 1)
  return { left: w - railW, railW, holeW, holeH, gap, count }
}

function Card({
  size,
  theme,
  night,
  live,
  idle,
  children,
}: {
  size: Size
  theme: WidgetTheme
  night: boolean
  live: boolean
  idle?: boolean
  children: React.ReactNode
}) {
  const uid = useId().replace(/[:]/g, '')
  const { box, s, left, top } = artFit(size)
  const rail = railHoles(size)
  const artOpacity = idle
    ? size === 'wide'
      ? 0.72
      : size === 'square'
        ? 0.9
        : 0.68
    : size === 'slim'
      ? 0.38
      : 0.24
  const op = (night ? artOpacity * 0.88 : artOpacity).toFixed(3)

  return (
    <div className={`wgt wgt-${size} is-${theme}${live ? ' is-live' : ''}`}>
      <div
        className="wgt-art"
        style={{
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          opacity: op,
        }}
      >
        <svg
          width={ART_W * s}
          height={ART_H * s}
          viewBox={`0 0 ${ART_W} ${ART_H}`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', left: left - box.x, top: top - box.y }}
          aria-hidden="true"
        >
          <Scene night={night} uid={uid} />
        </svg>
        {/* WidgetArt.drawHalftone — the print grain, deliberately almost invisible */}
        <span className="wgt-dots" />
      </div>

      {/* WidgetArt.drawScrim — the paper fades back up over the art so text wins */}
      <span className="wgt-scrim" aria-hidden="true" />

      <span
        className="wgt-rail"
        aria-hidden="true"
        style={{ left: rail.left, width: rail.railW }}
      >
        {Array.from({ length: rail.count }, (_, i) => (
          <i
            key={i}
            style={{
              left: (rail.railW - rail.holeW) / 2,
              top: rail.gap + i * (rail.holeH + rail.gap),
              width: rail.holeW,
              height: rail.holeH,
            }}
          />
        ))}
      </span>

      <div className="wgt-body">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * 4×2 — the timer desk (the only size with buttons)
 * ------------------------------------------------------------------ */

export function Widget4x2({
  theme = 'light',
  live = true,
  stage = 1,
}: {
  theme?: WidgetTheme
  live?: boolean
  stage?: number
}) {
  const { t } = useTranslation()
  const recipe = C41
  const step = recipe.steps[stage]
  const remaining = 252
  const pct = ((step.sec - remaining) / step.sec) * 100

  return (
    <Card size="wide" theme={theme} night={theme === 'dark'} live={live} idle={!live}>
      <div className="wgt-top">
        <span className="wgt-logo">ROTA</span>
        <span className="wgt-state">
          <i className="wgt-dot" />
          {live ? t('link.out.wRun') : t('link.out.wStandby')}
        </span>
      </div>

      {live ? (
        <div className="wgt-run">
          <div className="wgt-run-row">
            <div className="wgt-run-main">
              <span className="wgt-kicker">{t('link.out.wRemain')}</span>
              <span className="wgt-time">{fmtClock(remaining)}</span>
            </div>
            <div className="wgt-run-side">
              <span className="wgt-kicker">{t('link.out.wRecipe')}</span>
              <span className="wgt-rcp">{recipe.name}</span>
            </div>
          </div>
          <div className="wgt-steprow">
            <span className="wgt-step">{step.title}</span>
            <span className="wgt-idx">· 0{stage + 1} / 0{recipe.steps.length}</span>
            <span className="wgt-total">{fmtClock(step.sec)}</span>
          </div>
          <span className="wgt-bar">
            <i style={{ width: `${pct.toFixed(1)}%` }} />
          </span>
          <div className="wgt-btns">
            <span className="wgt-btn is-primary">
              <span className="wgt-glyph">Ⅱ</span>
              {t('link.out.wPause')}
            </span>
            <span className="wgt-btn is-ghost">
              <span className="wgt-glyph">»</span>
              {t('link.out.wSkip')}
            </span>
          </div>
        </div>
      ) : (
        <div className="wgt-idle">
          <p className="wgt-quote">{t('link.out.q1')}</p>
          <div className="wgt-last">
            <span className="wgt-rule" />
            <span className="wgt-last-k">{t('link.out.wLast')}</span>
            <span className="wgt-last-v">{recipe.name}</span>
            <span className="wgt-last-m">
              {recipe.steps.length} {t('link.out.wSteps')} · {fmtClock(totalSec(recipe))}
            </span>
          </div>
          <span className="wgt-btn is-primary is-block">
            <PlayFillIcon size={11} />
            {t('link.out.wStart')}
          </span>
        </div>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ *
 * 4×1 — the status strip (one line, twelve ticks, one round key)
 * ------------------------------------------------------------------ */

export function Widget4x1({
  theme = 'light',
  live = true,
  stage = 1,
}: {
  theme?: WidgetTheme
  live?: boolean
  stage?: number
}) {
  const { t } = useTranslation()
  const recipe = C41
  const step = recipe.steps[stage]
  const remaining = 252
  const done = Math.ceil(((step.sec - remaining) / step.sec) * 12)

  return (
    <Card size="slim" theme={theme} night={theme === 'dark'} live={live} idle={!live}>
      <div className="wgt-slim-row">
        <span className="wgt-logo">ROTA</span>
        {live ? (
          <>
            <span className="wgt-time">{fmtClock(remaining)}</span>
            <span className="wgt-slim-step">
              <span className="wgt-step">{step.title}</span>
              <span className="wgt-idx">
                0{stage + 1} / 0{recipe.steps.length}
              </span>
            </span>
            <span className="wgt-dial">Ⅱ</span>
          </>
        ) : (
          <>
            <span className="wgt-quote is-slim">{t('link.out.q2')}</span>
            <span className="wgt-slim-last">{recipe.name}</span>
          </>
        )}
      </div>
      {live && (
        <span className="wgt-ticks">
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} className={i < done ? 'on' : ''} />
          ))}
        </span>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ *
 * 2×2 — the square card (read-only)
 * ------------------------------------------------------------------ */

export function Widget2x2({
  theme = 'light',
  live = false,
  stage = 1,
}: {
  theme?: WidgetTheme
  live?: boolean
  stage?: number
}) {
  const { t } = useTranslation()
  const recipe = C41
  const step = recipe.steps[stage]
  const remaining = 252
  const pct = Math.round(((step.sec - remaining) / step.sec) * 100)

  return (
    <Card size="square" theme={theme} night={theme === 'dark'} live={live} idle={!live}>
      <div className="wgt-top">
        <span className="wgt-logo is-sm">ROTA</span>
        <span className="wgt-state">
          <i className="wgt-dot" />
          {live ? t('link.out.wRun') : t('link.out.wStandby')}
        </span>
      </div>

      {live ? (
        <div className="wgt-sq-run">
          <span className="wgt-time is-sq">{fmtClock(remaining)}</span>
          <div className="wgt-steprow">
            <span className="wgt-step">{step.title}</span>
            <span className="wgt-idx">· 0{stage + 1} / 0{recipe.steps.length}</span>
          </div>
          <span className="wgt-bar">
            <i style={{ width: `${pct}%` }} />
          </span>
          <div className="wgt-sq-reads">
            <span>{recipe.name}</span>
            <span>{pct}%</span>
          </div>
        </div>
      ) : (
        <div className="wgt-sq-idle">
          <p className="wgt-quote is-sq">{t('link.out.q3')}</p>
          <span className="wgt-sq-line" />
          <div className="wgt-sq-reads">
            <span className="is-cap">{t('link.out.wLast')}</span>
            <span>{recipe.name}</span>
          </div>
        </div>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ *
 * the launcher, so the cards can be seen where they actually live
 * ------------------------------------------------------------------ */

const GLYPHS: Record<string, React.ReactNode> = {
  camera: (
    <>
      <rect x="3" y="6.4" width="18" height="13.2" rx="3" />
      <circle cx="12" cy="13" r="3.9" />
      <path d="M9 6.4 10.2 4h3.6L15 6.4" />
    </>
  ),
  film: (
    <>
      <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2.2" />
      <path d="M7.6 5.4v13.2M16.4 5.4v13.2M3.2 9.6h4.4M3.2 14.4h4.4M16.4 9.6h4.4M16.4 14.4h4.4" />
    </>
  ),
  timer: (
    <>
      <circle cx="12" cy="13.2" r="7.2" />
      <path d="M12 9.6v3.6l2.4 1.6M9.4 3.4h5.2" />
    </>
  ),
  notes: (
    <>
      <rect x="5" y="3.8" width="14" height="16.4" rx="2.4" />
      <path d="M8.4 8.6h7.2M8.4 12h7.2M8.4 15.4h4.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.6 12h16.8M12 3.6c2.4 2.6 3.6 5.4 3.6 8.4s-1.2 5.8-3.6 8.4c-2.4-2.6-3.6-5.4-3.6-8.4S9.6 6.2 12 3.6Z" />
    </>
  ),
  message: (
    <>
      <path d="M4 6.2a2.4 2.4 0 0 1 2.4-2.4h11.2A2.4 2.4 0 0 1 20 6.2v7.6a2.4 2.4 0 0 1-2.4 2.4H9.6L5.4 19.6V16.2" />
      <path d="M8 8.6h8M8 12h5" />
    </>
  ),
  phone: (
    <>
      <path d="M6.4 3.6h3l1.6 4-2 1.6a11 11 0 0 0 5.8 5.8l1.6-2 4 1.6v3a2 2 0 0 1-2.2 2A16.8 16.8 0 0 1 4.4 5.8a2 2 0 0 1 2-2.2Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3.2" y="5.6" width="17.6" height="12.8" rx="2.4" />
      <path d="m4.4 7.4 7.6 5.6 7.6-5.6" />
    </>
  ),
  music: (
    <>
      <path d="M10 17.4V5.6l8-1.6v11.8" />
      <circle cx="7.6" cy="17.8" r="2.6" />
      <circle cx="15.6" cy="16" r="2.6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.4v2.6M12 18v2.6M3.4 12h2.6M18 12h2.6M5.9 5.9l1.9 1.9M16.2 16.2l1.9 1.9M18.1 5.9l-1.9 1.9M7.8 16.2l-1.9 1.9" />
    </>
  ),
  gallery: (
    <>
      <rect x="3.2" y="4.4" width="17.6" height="15.2" rx="2.6" />
      <path d="m4.6 17 4.6-5.2 3.4 3.8 3-3.2 4 4.6" />
      <circle cx="8.6" cy="8.8" r="1.5" />
    </>
  ),
}

/* ------------------------------------------------------------------ *
 * the launcher, so the cards can be seen where they actually live
 *
 * The grid is the whole argument. A 390 × 844 launcher, four columns and
 * seven rows above the dock: 80.5 dp cells, 12 dp between columns, 92 dp
 * pitch. That makes the widget heights provable rather than eyeballed —
 *
 *   one cell   = 82 dp   (widget_4x1, targetCellHeight 1)
 *   two cells  = 82 + 10 + 82 = 174 dp   (widget_4x2 / widget_2x2)
 *   four cells = 80.5 * 4 + 12 * 3 = 358 dp  (all of them, targetCellWidth 4)
 *   two cells  = 80.5 * 2 + 12 = 173 dp      (2×2, both axes)
 *
 * so a card always starts on a grid line and always ends on one. Nothing
 * here is nudged by eye.
 * ------------------------------------------------------------------ */

type Tile = { kind: keyof typeof GLYPHS | 'rota' | 'folder'; badge?: number }

const PITCH = 92 // rows are 92 dp apart, the 82 dp cells plus a 10 dp row gap
const TOP = 54 // first grid line, under the status bar
const COL0 = 16

const rowY = (k: number) => TOP + k * PITCH

function AppIcon({ tile }: { tile: Tile }) {
  const { kind, badge } = tile
  return (
    <span className={`lk-hs-icon${kind === 'rota' ? ' is-app' : ''}${kind === 'folder' ? ' is-folder' : ''}`}>
      {kind === 'rota' ? (
        <img src={href('/link/app-icon.png')} alt="" loading="lazy" decoding="async" />
      ) : kind === 'folder' ? (
        <>
          <i />
          <i />
          <i />
          <i />
        </>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {GLYPHS[kind]}
        </svg>
      )}
      {badge ? <span className="lk-hs-badge">{badge}</span> : null}
    </span>
  )
}

/** One launcher row on the grid. `null` keeps a cell empty — that is how a
 *  widget takes the left half of a row and the apps carry on to its right. */
function GridRow({ k, cells }: { k: number; cells: (Tile | null)[] }) {
  return (
    <div className="lk-hs-row" style={{ top: rowY(k) }}>
      {cells.map((tile, i) =>
        tile ? <AppIcon key={`${tile.kind}-${i}`} tile={tile} /> : <span key={`vac-${i}`} className="lk-hs-vac" />,
      )}
    </div>
  )
}

const DOCK: Tile[] = [{ kind: 'rota' }, { kind: 'phone' }, { kind: 'mail', badge: 1 }, { kind: 'camera' }]

/** The icon rows, in order, so each arrangement gets a different screen. */
const ICON_SETS: (Tile | null)[][] = [
  [{ kind: 'camera' }, { kind: 'gallery', badge: 12 }, { kind: 'film' }, { kind: 'notes' }],
  [{ kind: 'folder' }, { kind: 'globe' }, { kind: 'message', badge: 3 }, { kind: 'music' }],
  [{ kind: 'timer' }, { kind: 'mail', badge: 1 }, { kind: 'settings' }, { kind: 'gallery' }],
  [{ kind: 'film' }, { kind: 'notes' }, { kind: 'camera' }, { kind: 'folder' }],
  [{ kind: 'message', badge: 6 }, { kind: 'globe' }, { kind: 'music' }, { kind: 'timer' }],
  [{ kind: 'camera' }, { kind: 'notes' }, { kind: 'settings' }, { kind: 'mail', badge: 2 }],
]

const HALF = (a: Tile, b: Tile): (Tile | null)[] => [null, null, a, b]

/** Which rows carry icons, per arrangement — the widget rows are simply absent. */
const LAYOUT: Record<'wide' | 'slim' | 'square', (number | (Tile | null)[])[]> = {
  // 4×2 sits on rows 0–1; the apps run from row 2 to the dock
  wide: [2, 3, 4, 5, 6],
  // 4×1 takes row 2 — a strip between two rows of apps, nothing else moves
  slim: [0, 1, 3, 4, 5, 6],
  // 2×2 takes the left two cells of rows 0–1; two apps keep it company
  square: [
    HALF({ kind: 'camera' }, { kind: 'gallery', badge: 12 }),
    HALF({ kind: 'film' }, { kind: 'notes' }),
    2,
    3,
    4,
    5,
    6,
  ],
}

/**
 * The dark wall is drawn, not photographed: a navy→plum dusk, one warm sun
 * that sits where the widget's own sun sits, two thin brass rings and grain.
 * It keeps the pair honest — light shows the film photo, dark shows something
 * that belongs to the same world without being the same picture.
 */
function DarkWall({ uid }: { uid: string }) {
  const sky = `sky-${uid}`
  const glow = `glow-${uid}`
  const arc = `arc-${uid}`
  return (
    <svg className="lk-hs-wall is-drawn" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={sky} x1="0.12" y1="0" x2="0.78" y2="1">
          <stop offset="0" stopColor="#0a0d18" />
          <stop offset="0.34" stopColor="#171a2c" />
          <stop offset="0.62" stopColor="#281e31" />
          <stop offset="0.84" stopColor="#3a2330" />
          <stop offset="1" stopColor="#2a1a26" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ee8f6c" stopOpacity="0.5" />
          <stop offset="0.44" stopColor="#d4646a" stopOpacity="0.2" />
          <stop offset="1" stopColor="#c25a6a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={arc} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#c39a63" stopOpacity="0" />
          <stop offset="0.46" stopColor="#e2c192" stopOpacity="0.62" />
          <stop offset="1" stopColor="#c39a63" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="390" height="844" fill={`url(#${sky})`} />
      <ellipse cx="212" cy="566" rx="252" ry="216" fill={`url(#${glow})`} />
      <circle cx="212" cy="566" r="122" fill="none" stroke={`url(#${arc})`} strokeWidth="1" opacity="0.55" />
      <circle cx="212" cy="566" r="86" fill="#e8836b" opacity="0.13" />
      <circle cx="212" cy="566" r="54" fill="#f0a184" opacity="0.1" />
      <path
        d="M-40 706c84-58 168-58 252 0s168 58 252 0"
        fill="none"
        stroke="#c39a63"
        strokeOpacity="0.16"
        strokeWidth="1"
      />
      <path
        d="M-40 748c84-58 168-58 252 0s168 58 252 0"
        fill="none"
        stroke="#c39a63"
        strokeOpacity="0.1"
        strokeWidth="1"
      />
    </svg>
  )
}

export type WidgetState = 'live' | 'idle'

/**
 * One launcher, one card, at 390 × 844.
 *
 * The three arrangements answer the same question three ways — "where does
 * this card go in a screen that is already full?" — and each pair is the same
 * layout twice, so the only thing that changes between the left and right
 * phone is the system theme and therefore the card.
 *
 *   wide    the card takes the top two rows, the apps start under it
 *   slim    one strip on row 2, between two rows of icons, nothing else moves
 *   square  two cells of rows 0–1, with two apps keeping it company
 *
 * `state` is what the card is doing, not what the theme is: a timer is either
 * running or it is not, in light and in dark alike.
 */
export function HomeScreen({
  theme,
  arrange = 'wide',
  state = 'live',
}: {
  theme: WidgetTheme
  arrange?: 'wide' | 'slim' | 'square'
  state?: WidgetState
}) {
  const live = state === 'live'
  const slots = LAYOUT[arrange]

  return (
    <div className={`lk-hs is-${theme}`}>
      {theme === 'light' ? (
        <img className="lk-hs-wall" src={href('/link/filmlog/c2-3.webp')} alt="" decoding="async" />
      ) : (
        <DarkWall uid="hs" />
      )}
      <span className="lk-hs-veil" aria-hidden="true" />
      <span className="lk-hs-grain" aria-hidden="true" />

      <div className="lk-hs-status">
        <span>09:41</span>
        <span className="lk-hs-sys">
          <WifiGlyph />
          <BatteryGlyph />
        </span>
      </div>

      {arrange === 'wide' && (
        <div className="lk-hs-at" style={{ top: TOP, left: COL0 }}>
          <Widget4x2 theme={theme} live={live} />
        </div>
      )}

      {arrange === 'slim' && (
        <div className="lk-hs-at" style={{ top: rowY(2), left: COL0 }}>
          <Widget4x1 theme={theme} live={live} />
        </div>
      )}

      {arrange === 'square' && (
        <div className="lk-hs-at" style={{ top: TOP, left: COL0 }}>
          <Widget2x2 theme={theme} live={live} />
        </div>
      )}

      {slots.map((slot, k) =>
        Array.isArray(slot) ? (
          <GridRow key={`slot-${k}`} k={k} cells={slot} />
        ) : (
          <GridRow key={`slot-${k}`} k={slot} cells={ICON_SETS[k % ICON_SETS.length]} />
        ),
      )}

      <span className="lk-hs-dots">
        <i />
        <i className="on" />
        <i />
      </span>

      <div className="lk-hs-dock">
        {DOCK.map((tile, i) => (
          <AppIcon key={`${tile.kind}-${i}`} tile={tile} />
        ))}
      </div>

      <span className="lk-hs-pill" />
    </div>
  )
}
