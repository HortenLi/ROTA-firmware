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

/** 358 × 174 / 358 × 82 / 173 × 174 — the launcher's real grid sizes. */
const DIM: Record<Size, [number, number]> = {
  wide: [358, 174],
  slim: [358, 82],
  square: [173, 174],
}

/** WidgetSize.railDp — the film strip, hard-wired in all three layouts. */
const RAIL: Record<Size, number> = { wide: 26, slim: 22, square: 18 }

/* ------------------------------------------------------------------ *
 * the illustration (WidgetArt.sceneDay / sceneNight, same numbers)
 * ------------------------------------------------------------------ */

const DAY = {
  top: '#E9E2D1',
  mid: '#E9D2B4',
  low: '#C9A77D',
  sun: '#D66B3F',
  ridgeBack: '#2E544C',
  ridgeFront: '#254B47',
  dune: '#C75C3B',
  stripe: '#F2EDE0',
  sprocket: '#F2F0E8',
  palm: '#1B211F',
}

const NIGHT = {
  sky0: '#493052',
  sky1: '#272039',
  sky2: '#171523',
  sunTop: '#F05A85',
  sunLow: '#FF8B55',
  slice: '#272039',
  city: '#10121D',
  window: '#F7B96E',
  neonPink: '#F05A85',
  neonTeal: '#55D6CF',
  palm: '#10121D',
}

function ridgeD(pts: number[]): string {
  let d = `M${pts[0]} ${pts[1]}`
  for (let i = 2; i < pts.length; i += 2) d += ` L${pts[i]} ${pts[i + 1]}`
  return `${d} L420 330 L${pts[0]} 330 Z`
}

/**
 * Palm — the one-brushstroke silhouette from the visual book.
 *
 * Six fronds, each drawn as "throw out, curl back": a quad curve out to the tip
 * and a second one home, so the leaf is a crescent with a wide root and a point,
 * not a sausage. The trunk is a single quad closed on itself (a sliver), which
 * is why it needs a fat stroke to survive at widget size.
 *
 * The geometry lives in a 250 × 350 local space, exactly as the app has it, and
 * is scaled into place — so the shape is the same drawing at every card size.
 */
const PALM_VH = 350
const PALM_BX = 110

const PALM_TRUNK = 'M110 350 Q120 185 130 85 Z'

const PALM_FRONDS = [
  'M130 85 Q50 15 5 45 Q68 32 130 85 Z',
  'M130 85 Q110 20 78 0 Q132 25 130 85 Z',
  'M130 85 Q165 5 230 18 Q168 42 130 85 Z',
  'M130 85 Q220 70 250 125 Q180 94 130 85 Z',
  'M130 85 Q180 140 205 190 Q155 130 130 85 Z',
  'M130 85 Q75 130 30 195 Q65 125 130 85 Z',
]

function Palm({
  baseX,
  baseY,
  height,
  fill,
  neon,
}: {
  baseX: number
  baseY: number
  height: number
  fill: string
  neon?: string
}) {
  const s = height / PALM_VH
  return (
    <g transform={`translate(${baseX - PALM_BX * s} ${baseY - PALM_VH * s}) scale(${s})`}>
      {PALM_FRONDS.map((d) => (
        <path key={d} d={d} fill={fill} />
      ))}
      <path d={PALM_TRUNK} fill={fill} stroke={fill} strokeWidth={7} strokeLinecap="round" />
      {neon ? (
        <>
          {PALM_FRONDS.map((d) => (
            <path
              key={`o${d}`}
              d={d}
              fill="none"
              stroke={neon}
              strokeOpacity={0.08}
              strokeWidth={18}
              strokeLinejoin="round"
            />
          ))}
          {PALM_FRONDS.map((d) => (
            <path
              key={`i${d}`}
              d={d}
              fill="none"
              stroke={neon}
              strokeOpacity={0.2}
              strokeWidth={9}
              strokeLinejoin="round"
            />
          ))}
          {PALM_FRONDS.map((d) => (
            <path
              key={`c${d}`}
              d={d}
              fill="none"
              stroke={neon}
              strokeWidth={2.4}
              strokeLinejoin="round"
            />
          ))}
          <path d={PALM_TRUNK} fill="none" stroke={neon} strokeWidth={2.4} />
        </>
      ) : null}
    </g>
  )
}

/**
 * The sun — solid disc, then banded by the sky it hangs in.
 *
 * The horizontal slices are the signature of this whole language: they turn a
 * flat coin into a sun cut open by the atmosphere. Bars are 1.55 / 1.7 units
 * thick on a 9 / 9.5 period, clipped to the disc.
 */
function SunDisc({
  uid,
  cx,
  cy,
  r,
  top,
  bottom,
  slice,
  period,
  thick,
  halo,
}: {
  uid: string
  cx: number
  cy: number
  r: number
  top: string
  bottom?: string
  slice: string
  period: number
  thick: number
  halo?: string
}) {
  const grad = `${uid}-sun`
  const clip = `${uid}-sunc`
  const glow = `${uid}-halo`
  const bars: number[] = []
  for (let y = cy - r; y < cy + r; y += period) bars.push(y)
  return (
    <>
      {halo ? (
        <>
          <defs>
            <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor={halo} stopOpacity={0.3} />
              <stop offset="0.44" stopColor={halo} stopOpacity={0.16} />
              <stop offset="0.76" stopColor={halo} stopOpacity={0.05} />
              <stop offset="1" stopColor={halo} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r * 1.32} fill={`url(#${glow})`} />
        </>
      ) : null}
      {bottom ? (
        <defs>
          <linearGradient id={grad} x1="0" y1={cy - r} x2="0" y2={cy + r} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={top} />
            <stop offset="1" stopColor={bottom} />
          </linearGradient>
        </defs>
      ) : null}
      <clipPath id={clip}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={bottom ? `url(#${grad})` : top} />
      <g clipPath={`url(#${clip})`}>
        {bars.map((y) => (
          <rect key={y} x={cx - r} y={y} width={r * 2} height={thick} fill={slice} />
        ))}
      </g>
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

/**
 * WidgetArt.sceneDay / sceneNight, coordinate for coordinate.
 *
 * Day is a California road movie: raking 145° light, a striped sun, two green
 * ridges over a red dune, three subtitle rules, three sprockets, one palm.
 * Night is Los Angeles: a radial purple sky, a pink-to-orange sun with a glow,
 * a skyline full of lit windows, and two palms drawn in neon tubing.
 */
function Scene({ night, uid }: { night: boolean; uid: string }) {
  if (!night) {
    return (
      <>
        <defs>
          <linearGradient id={`${uid}-day`} x1="0" y1="0" x2={ART_W} y2={ART_H} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={DAY.top} />
            <stop offset="0.48" stopColor={DAY.mid} />
            <stop offset="1" stopColor={DAY.low} />
          </linearGradient>
        </defs>
        <rect width={ART_W} height={ART_H} fill={`url(#${uid}-day)`} />

        <SunDisc uid={uid} cx={258} cy={104} r={62} top={DAY.sun} slice={DAY.mid} period={9} thick={1.55} />

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

        <Palm baseX={88} baseY={302} height={176} fill={DAY.palm} />
      </>
    )
  }

  return (
    <>
      <defs>
        <radialGradient id={`${uid}-night`} cx="0.5" cy="0.42" r="0.78" fx="0.5" fy="0.42">
          <stop offset="0" stopColor={NIGHT.sky0} />
          <stop offset="0.43" stopColor={NIGHT.sky1} />
          <stop offset="1" stopColor={NIGHT.sky2} />
        </radialGradient>
      </defs>
      <rect width={ART_W} height={ART_H} fill={`url(#${uid}-night)`} />

      <SunDisc
        uid={uid}
        cx={268}
        cy={116}
        r={64}
        top={NIGHT.sunTop}
        bottom={NIGHT.sunLow}
        slice={NIGHT.slice}
        period={9.5}
        thick={1.7}
        halo={NIGHT.neonPink}
      />

      <path d={cityD()} fill={NIGHT.city} />
      {CITY_WINDOWS.reduce<JSX.Element[]>((acc, v, i) => {
        if (i % 2 === 0) {
          acc.push(
            <rect key={v} x={v} y={CITY_WINDOWS[i + 1]} width={5} height={8} fill={NIGHT.window} />,
          )
        }
        return acc
      }, [])}

      <Palm baseX={84} baseY={300} height={166} fill={NIGHT.palm} neon={NIGHT.neonTeal} />
      <Palm baseX={384} baseY={300} height={128} fill={NIGHT.palm} neon={NIGHT.neonPink} />

      <rect y={254} width={ART_W} height={36} fill={NIGHT.city} fillOpacity={0.863} />
      {/* glowLine: three widening passes under one crisp line */}
      <g stroke={NIGHT.neonTeal} strokeLinecap="round">
        <path d="M0 258H420" strokeWidth={14} strokeOpacity={0.3} />
        <path d="M0 258H420" strokeWidth={10} strokeOpacity={0.24} />
        <path d="M0 258H420" strokeWidth={6} strokeOpacity={0.16} />
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
  const op = (night ? artOpacity * 0.96 : artOpacity).toFixed(3)

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

/**
 * One of the card's two faces.
 *
 * Both faces stay mounted and cross-dissolve, because the thing that changes
 * is what the timer is doing, not which screen you are on — and a timer that
 * snaps reads as a broken widget. The app redraws a bitmap on every tick, so
 * the honest web equivalent is a slow dissolve, not a slide.
 */
function Face({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div className="wgt-face" data-on={on} aria-hidden={!on}>
      {children}
    </div>
  )
}

/** The shared first line: wordmark left, what the timer is doing right. */
function Top({ live, small = false }: { live: boolean; small?: boolean }) {
  const { t } = useTranslation()
  return (
    <div className="wgt-top">
      <span className={`wgt-logo${small ? ' is-sm' : ''}`}>ROTA</span>
      <span className="wgt-state">
        <i className="wgt-dot" />
        {live ? t('link.out.wRun') : t('link.out.wStandby')}
      </span>
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
      <Face on={live}>
        <Top live />
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
      </Face>

      <Face on={!live}>
        <Top live={false} />
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
      </Face>
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
      <Face on={live}>
        <div className="wgt-slim-row">
          <span className="wgt-logo">ROTA</span>
          <span className="wgt-time">{fmtClock(remaining)}</span>
          <span className="wgt-slim-step">
            <span className="wgt-step">{step.title}</span>
            <span className="wgt-idx">
              0{stage + 1} / 0{recipe.steps.length}
            </span>
          </span>
          <span className="wgt-dial">Ⅱ</span>
        </div>
        <span className="wgt-ticks">
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} className={i < done ? 'on' : ''} />
          ))}
        </span>
      </Face>

      <Face on={!live}>
        <div className="wgt-slim-row">
          <span className="wgt-logo">ROTA</span>
          <span className="wgt-quote is-slim">{t('link.out.q2')}</span>
          <span className="wgt-slim-last">{recipe.name}</span>
        </div>
      </Face>
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
      <Face on={live}>
        <Top live small />
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
      </Face>

      <Face on={!live}>
        <Top live={false} small />
        <div className="wgt-sq-idle">
          <p className="wgt-quote is-sq">{t('link.out.q3')}</p>
          <span className="wgt-sq-line" />
          <div className="wgt-sq-reads">
            <span className="is-cap">{t('link.out.wLast')}</span>
            <span>{recipe.name}</span>
          </div>
        </div>
      </Face>
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
/**
 * The light half of the pair: paper at dawn.
 *
 * Not a photograph — the same rule the dark side follows. It is the widget's
 * own day scene pushed out to full screen: warm paper, one low sun, two brass
 * hairlines for a horizon. Nothing in it competes with an icon or a card.
 */
function LightWall({ uid }: { uid: string }) {
  const sky = `lsky-${uid}`
  const glow = `lglow-${uid}`
  const arc = `larc-${uid}`
  return (
    <svg className="lk-hs-wall is-drawn" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={sky} x1="0.1" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#eee4d0" />
          <stop offset="0.38" stopColor="#e2d5ba" />
          <stop offset="0.68" stopColor="#d4c19f" />
          <stop offset="1" stopColor="#c0aa86" />
        </linearGradient>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffaf0" stopOpacity="0.92" />
          <stop offset="0.42" stopColor="#f7e6c6" stopOpacity="0.45" />
          <stop offset="1" stopColor="#e7cda4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={arc} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#b48b51" stopOpacity="0" />
          <stop offset="0.5" stopColor="#a8834a" stopOpacity="0.5" />
          <stop offset="1" stopColor="#b48b51" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="390" height="844" fill={`url(#${sky})`} />
      <ellipse cx="286" cy="392" rx="268" ry="238" fill={`url(#${glow})`} />
      <circle cx="286" cy="392" r="112" fill="none" stroke={`url(#${arc})`} strokeWidth="1" opacity="0.5" />
      <circle cx="286" cy="392" r="86" fill="#fffdf6" opacity="0.5" />
      <path
        d="M-40 660c84-46 168-46 252 0s168 46 252 0"
        fill="none"
        stroke="#a8834a"
        strokeOpacity="0.14"
        strokeWidth="1"
      />
      <path
        d="M-40 700c84-46 168-46 252 0s168 46 252 0"
        fill="none"
        stroke="#a8834a"
        strokeOpacity="0.09"
        strokeWidth="1"
      />
    </svg>
  )
}

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
  const uid = useId().replace(/[:]/g, '')

  return (
    <div className={`lk-hs is-${theme}`}>
      {theme === 'light' ? <LightWall uid={uid} /> : <DarkWall uid={uid} />}
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
