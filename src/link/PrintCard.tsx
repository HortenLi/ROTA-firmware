import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { href } from '../router'

/**
 * The PRINT template — one photograph on a sheet of coloured paper, rebuilt at
 * its real 1080 px export width and scaled by <Stage>.
 *
 * Every number below is copied from `PrintSpec.kt`, which is the single source
 * of truth shared by the Compose preview and the Canvas exporter. That is the
 * whole point of the file: the geometry is `fraction × W`, so the 300 dp
 * preview and the 1080 px PNG are the same layout, and this DOM is a third
 * renderer reading the same ratios. No eyeballing.
 *
 * The photo is a window + content pair. `fit` scales the picture until one
 * side touches the window, so at zoom 1 nothing is cropped; the window is the
 * margin-to-margin, margin-to-band rectangle and it clips. Vertical position
 * is biased — 4:5 sits at 0.44 of the leftover space (a mounted-print look),
 * 1:1 sits dead centre at 0.5, because an off-centre square reads as a mistake.
 */

const W = 1080

const R_MARGIN = 0.072
const R_BAND: Record<PrintRatio, number> = { 11: 0.19, 45: 0.205 }
const R_CAPTION = 0.038
const R_DETAIL = 0.016
const CAP_LH = 1.3
const BIAS: Record<PrintRatio, number> = { 11: 0.5, 45: 0.44 }
const DETAIL_TRACKING = 0.055

/** 0 = 1:1 square, 1 = 4:5 portrait — `PrintDraft.RATIO_11 / RATIO_45`. */
export type PrintRatio = 11 | 45

/**
 * `PRINT_PALETTE` from `data/FilmPrintStore.kt`, ordered by relative luminance
 * so the strip reads as a tonal ramp rather than a list. Omitting the two
 * already on the sheets would be tidier, but the point is the whole set.
 */
export const PRINT_PAPERS = [
  '#eae7df', '#e3dccb', '#dddbd4', '#d6d1c8', '#bfc0bd', '#bdb9b0',
  '#b5b9a6', '#a9b5ba', '#c5aaa6', '#bba597', '#62685b', '#333431',
]

type PrintData = {
  /** Photo file under /link/filmlog. */
  file: string
  /** Stored aspect, width / height. */
  aspect: number
  ratio: PrintRatio
  /** Paper colour (ARGB as hex) — `PRINT_PALETTE`. */
  paper: string
  /** Locale suffix for the caption and the camera line: link.film.<cap>t / <cam>. */
  source: string
}

/**
 * Two sheets, deliberately one light and one dark: the template is the same
 * layout twice, and the only thing that changes is the paper — which is also
 * the only thing that changes the type. That contrast cannot be made with one.
 */
export const PRINT_SHEETS: PrintData[] = [
  { file: 'c2-2.webp', aspect: 816 / 1000, ratio: 45, paper: '#eae7df', source: 'c2' },
  { file: 'c3-2.webp', aspect: 1000 / 911, ratio: 11, paper: '#333431', source: 'c3' },
]

function canvasHeight(ratio: PrintRatio) {
  return W * (ratio === 11 ? 1 : 1.25)
}

/** `PrintSpec.photoBox` at pan 0 / zoom 1 — the default composition. */
function photoBox(ratio: PrintRatio, aspect: number) {
  const h = canvasHeight(ratio)
  const m = W * R_MARGIN
  const regionW = W - m * 2
  const regionH = h - W * R_BAND[ratio] - m
  let fitW: number
  let fitH: number
  if (regionW / regionH > aspect) {
    fitH = regionH
    fitW = regionH * aspect
  } else {
    fitW = regionW
    fitH = regionW / aspect
  }
  const anchorY = m + ((regionH - fitH) / 2) * (BIAS[ratio] * 2) + fitH / 2
  return {
    h,
    m,
    regionW,
    regionH,
    left: m + regionW / 2 - fitW / 2,
    top: anchorY - fitH / 2,
    width: fitW,
    height: fitH,
  }
}

/** `PrintSpec.luminance` — sRGB relative luminance, only used to ask "is this paper dark?". */
function luminance(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16)
  const ch = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * ch((n >> 16) & 0xff) + 0.7152 * ch((n >> 8) & 0xff) + 0.0722 * ch(n & 0xff)
}

/** `PrintSpec.dimOf` — 78% ink mixed into 22% paper, so nothing is exported with alpha. */
function dimOf(paper: string, ink: string) {
  const p = parseInt(paper.replace('#', ''), 16)
  const i = parseInt(ink.replace('#', ''), 16)
  const mix = (shift: number) => {
    const a = (i >> shift) & 0xff
    const b = (p >> shift) & 0xff
    return Math.round(a * 0.78 + b * 0.22)
  }
  return `rgb(${mix(16)}, ${mix(8)}, ${mix(0)})`
}

export default function PrintCard({ data }: { data: PrintData }) {
  const { t } = useTranslation()
  const box = photoBox(data.ratio, data.aspect)
  const ink = luminance(data.paper) > 0.45 ? '#333431' : '#f2f0e8'
  const dim = dimOf(data.paper, ink)

  return (
    <div
      className="upr"
      style={{
        '--w': `${W}px`,
        '--upr-bg': data.paper,
        '--upr-ink': ink,
        '--upr-dim': dim,
        '--upr-cap': R_CAPTION,
        '--upr-detail': R_DETAIL,
        '--upr-lh': CAP_LH,
        '--upr-tr': `${DETAIL_TRACKING}em`,
        height: box.h,
      } as CSSProperties}
    >
      <div
        className="upr-window"
        style={{ left: box.m, top: box.m, width: box.regionW, height: box.regionH }}
      >
        <img
          src={href(`/link/filmlog/${data.file}`)}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            left: box.left - box.m,
            top: box.top - box.m,
            width: box.width,
            height: box.height,
          }}
        />
      </div>

      <div className="upr-foot" style={{ left: box.m, right: box.m, bottom: box.m * 0.92 }}>
        <p className="upr-caption">{t(`link.film.${data.source}t`)}</p>
        <div className="upr-detail">
          <span>{t(`link.film.${data.source}c`)}</span>
          <span className="upr-mark">Remembered with ROTA</span>
        </div>
      </div>
    </div>
  )
}
