import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { href } from '../router'
import { BUILTIN_RECIPES, fmtClock } from './appData'

/**
 * The exported Film Log card, rebuilt as DOM at its real 1080 px width and
 * scaled down by <Stage>. Every measurement is a fraction of the card width,
 * copied from `FilmCardSpec.kt` — the same numbers the app's Canvas exporter
 * uses, so this is the layout the PNG actually has, not an approximation of it.
 *
 * Three cards, three rolls: 135 black and white, 6×7 colour reversal, and a
 * 135 colour negative scanned with its rebate on. They exist to show what the
 * row planner does with different frame ratios — a 3:2 landscape takes a row
 * on its own, two portraits share one, a near-square frame takes a row by
 * itself again — which a single card cannot show.
 */

const W = 1080
const PAD = 0.055
const GAP = 0.014
const CONTENT = 1 - PAD * 2

type Frame = { file: string; w: number; h: number }

export type FilmCardData = {
  /** Locale suffix: the copy lives at link.film.<id>t / f / c / n / p. */
  id: string
  frames: Frame[]
  /** Index into BUILTIN_RECIPES — the process this roll actually went through. */
  recipe: number
  roll: string
}

export const FILM_CARDS: FilmCardData[] = [
  {
    // Fomapan 400 through a Bessa R4A and the Jupiter-12. Portraits first so
    // the planner puts them side by side, then the two 3:2 frames full width.
    // The two portraits are frames 31 and 26 of the roll, shot upright and
    // stored landscape by the scanner — turned back here, not cropped out of
    // a landscape frame.
    id: 'c1',
    recipe: 0,
    roll: 'ROLL 001',
    frames: [
      { file: 'c1-3.webp', w: 663, h: 1000 },
      { file: 'c1-4.webp', w: 663, h: 1000 },
      { file: 'c1-1.webp', w: 1000, h: 663 },
      { file: 'c1-2.webp', w: 1000, h: 663 },
    ],
  },
  {
    // Velvia 100 on 6×7 — 1.225 : 1, close enough to square that a landscape
    // and a portrait fit on one row together.
    id: 'c2',
    recipe: 3,
    roll: 'ROLL 002',
    frames: [
      { file: 'c2-1.webp', w: 1000, h: 816 },
      { file: 'c2-2.webp', w: 816, h: 1000 },
      { file: 'c2-3.webp', w: 1000, h: 816 },
      { file: 'c2-4.webp', w: 816, h: 1000 },
      { file: 'c2-5.webp', w: 816, h: 1000 },
      { file: 'c2-6.webp', w: 816, h: 1000 },
    ],
  },
  {
    // Lucky C200, full-frame scans with the rebate left on — the frames are
    // almost square, so each one is a row of its own.
    id: 'c3',
    recipe: 1,
    roll: 'ROLL 003',
    frames: [
      { file: 'c3-2.webp', w: 1000, h: 911 },
      { file: 'c3-3.webp', w: 1000, h: 921 },
    ],
  },
]

const aspectOf = (f: Frame) => f.w / f.h

/**
 * Row plan, straight from `photoRows()`: a portrait is 1 unit, a landscape 2,
 * a row holds at most 2 photos and 3 units. Then `rowHeightOf()`: the row is
 * justified to the content width, capped at it so a lone portrait cannot grow
 * taller than the card is wide.
 */
function plan(frames: Frame[]) {
  const a = frames.map(aspectOf)
  const rows: number[][] = []
  let cur: number[] = []
  let units = 0
  a.forEach((x, i) => {
    const u = x >= 1 ? 2 : 1
    if (cur.length > 0 && (cur.length >= 2 || units + u > 3)) {
      rows.push(cur)
      cur = []
      units = 0
    }
    cur.push(i)
    units += u
  })
  if (cur.length) rows.push(cur)

  return rows.map((cells) => {
    const sum = cells.reduce((s, i) => s + a[i], 0)
    const h = Math.min((CONTENT - GAP * (cells.length - 1)) / sum, CONTENT)
    return { cells, h, widths: cells.map((i) => h * a[i]) }
  })
}

/** A fraction of the card width, as a CSS length. */
const w = (ratio: number) => `calc(var(--w) * ${ratio})`

export default function FilmLogCard({ card, className }: { card: FilmCardData; className?: string }) {
  const { t } = useTranslation()
  const recipe = BUILTIN_RECIPES[card.recipe]
  const rows = plan(card.frames)
  const year = new Date().getFullYear()

  return (
    <div
      className={`ufc${className ? ` ${className}` : ''}`}
      style={{ '--w': `${W}px` } as CSSProperties}
    >
      <div className="ufc-head">
        <div>
          <div className="ufc-logo">FILM LOG</div>
          <div className="ufc-tag">{t('link.film.archive')}</div>
        </div>
        <div className="ufc-meta">
          {year} · {String(card.frames.length).padStart(2, '0')} FRAMES
        </div>
      </div>

      <div className="ufc-rule" />

      <h3 className="ufc-title">{t(`link.film.${card.id}t`)}</h3>

      <div className="ufc-film">
        <FilmGlyph />
        <span>{t(`link.film.${card.id}f`)}</span>
      </div>

      <div className="ufc-camera">
        <CameraGlyph />
        <span>{t(`link.film.${card.id}c`)}</span>
      </div>

      <div className="ufc-grid">
        {rows.map((row, ri) => (
          <div className="ufc-row" key={ri} style={{ height: w(row.h) }}>
            {row.cells.map((ci, k) => (
              <img
                key={ci}
                src={href(`/link/filmlog/${card.frames[ci].file}`)}
                width={card.frames[ci].w}
                height={card.frames[ci].h}
                alt=""
                loading="lazy"
                decoding="async"
                style={{ width: w(row.widths[k]) }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="ufc-gap-info" />

      <div className="ufc-eyebrow">{t('link.film.processRecord')}</div>
      <div className="ufc-recipe">
        <span className="ufc-recipe-name">{recipe.name}</span>
        <span className="ufc-temp">{recipe.temperatureC.toFixed(1)}°C</span>
      </div>

      <ol className="ufc-steps">
        {recipe.steps.map((s, i) => (
          <li key={s.title}>
            <span className="ufc-stepno">{String(i + 1).padStart(2, '0')}</span>
            <span className="ufc-stepname">{s.title}</span>
            <span className="ufc-stepdur">{fmtClock(s.sec)}</span>
          </li>
        ))}
      </ol>

      <p className="ufc-note">{t(`link.film.${card.id}n`)}</p>

      <div className="ufc-rule ufc-rule-foot" />

      <div className="ufc-foot">
        <div>
          <div className="ufc-roll">{card.roll}</div>
          <div className="ufc-slogan">Shot on Film. Remembered with ROTA.</div>
        </div>
        <div className="ufc-sign">ROTA</div>
      </div>
    </div>
  )
}


/**
 * Camera body with the lens ring and the small lamp — the app's `CAMERA_GLYPH`
 * on the same 24-unit grid, stroke 1.7. Drawn, not typed: the card has no icon
 * font and the exporter draws it path by path.
 */
function CameraGlyph() {
  return (
    <svg className="ufc-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <rect x="3.9" y="7.4" width="16.2" height="11.6" rx="2.1" />
        <path d="M9.85 7.4V6.05a0.9 0.9 0 0 1 0.9-0.9h3.5a0.9 0.9 0 0 1 0.9 0.9V7.4" />
        <circle cx="11.7" cy="13.6" r="3.4" />
      </g>
      <g fill="currentColor">
        <circle cx="17.5" cy="10.2" r="0.72" />
      </g>
    </svg>
  )
}

/**
 * 135 cassette + a strip of film. Paths and dimensions are the app's
 * `FILM_GLYPH` (24-unit grid): spool, cap, body, base, then the strip, with the
 * highlight slot and two rows of sprocket holes punched in the card's own
 * background colour.
 */
function FilmGlyph() {
  return (
    <svg className="ufc-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="currentColor">
        <rect x="7" y="2.1" width="2.6" height="1.3" rx="0.5" />
        <rect x="3" y="3.4" width="9.6" height="1.7" rx="0.75" />
        <rect x="4.2" y="5.1" width="7.2" height="13.4" rx="0.12" />
        <rect x="3" y="18.5" width="9.6" height="1.7" rx="0.75" />
        <rect x="11.4" y="7.3" width="9.5" height="7.4" rx="0.55" />
      </g>
      <g fill="var(--ufc-bg)">
        <rect x="6.35" y="7.9" width="0.63" height="8.5" rx="0.31" />
        <rect x="12.9" y="8" width="1.1" height="1.1" rx="0.14" />
        <rect x="15.4" y="8" width="1.1" height="1.1" rx="0.14" />
        <rect x="17.9" y="8" width="1.1" height="1.1" rx="0.14" />
        <rect x="12.9" y="12.9" width="1.1" height="1.1" rx="0.14" />
        <rect x="15.4" y="12.9" width="1.1" height="1.1" rx="0.14" />
        <rect x="17.9" y="12.9" width="1.1" height="1.1" rx="0.14" />
      </g>
    </svg>
  )
}
