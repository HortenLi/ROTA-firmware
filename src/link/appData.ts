/**
 * A read-only mirror of the real ROTA Link recipe seed data.
 *
 * Source of truth: RotaLink/app/src/main/java/com/rota/link/data/RecipeRepository.kt
 *   · seed()            — the five built-in slots and their steps
 *   · defaultName(slot) — built-in display names
 *   · slotLabel(slot)   — process codes (BW / C41 / ECN2 / E6 / BWR)
 *   · builtinNoteKey()  — the machine-side note line of each built-in slot
 *
 * Step titles are firmware-side strings and are NOT localised in the app, so
 * they stay English here too — the page must not invent a UI the app does not
 * have. Temperatures are per recipe, not per step (that is how the controller
 * stores them). Update this file only when the app's seed data changes.
 */

export type AppStep = { title: string; sec: number }

export type AppRecipe = {
  slot: number
  /** Built-in display name, exactly as the app renders it. */
  name: string
  /** Process code shown in the metadata row (slotLabel). */
  process: string
  temperatureC: number
  rpm: number
  steps: AppStep[]
  /** Machine note copy of the built-in slot (builtinNoteKey). */
  note: string
}

export const BUILTIN_RECIPES: AppRecipe[] = [
  {
    slot: 1,
    name: 'B&W Negative',
    process: 'BW',
    temperatureC: 20,
    rpm: 60,
    steps: [
      { title: 'Pre-soak', sec: 60 },
      { title: 'Developer', sec: 480 },
      { title: 'Stop', sec: 30 },
      { title: 'Fix', sec: 300 },
      { title: 'Wash', sec: 600 },
    ],
    note: 'Let Color Come to Life.',
  },
  {
    slot: 2,
    name: 'C-41',
    process: 'C41',
    temperatureC: 38,
    rpm: 60,
    steps: [
      { title: 'Developer', sec: 195 },
      { title: 'Bleach', sec: 390 },
      { title: 'Wash', sec: 180 },
      { title: 'Fix', sec: 390 },
      { title: 'Stabilizer', sec: 90 },
    ],
    note: 'Stories in Light and Shadow.',
  },
  {
    slot: 3,
    name: 'ECN-2',
    process: 'ECN2',
    temperatureC: 41,
    rpm: 60,
    steps: [
      { title: 'Pre-soak', sec: 60 },
      { title: 'Rem-jet removal', sec: 120 },
      { title: 'Developer', sec: 180 },
      { title: 'Stop', sec: 30 },
      { title: 'Bleach', sec: 240 },
      { title: 'Fix', sec: 180 },
      { title: 'Wash', sec: 300 },
    ],
    note: 'Every Frame Tells a Story.',
  },
  {
    slot: 4,
    name: 'E-6',
    process: 'E6',
    temperatureC: 38,
    rpm: 60,
    steps: [
      { title: 'First developer', sec: 420 },
      { title: 'Wash', sec: 120 },
      { title: 'Color developer', sec: 360 },
      { title: 'Pre-bleach', sec: 120 },
      { title: 'Bleach', sec: 360 },
      { title: 'Fix', sec: 240 },
      { title: 'Wash', sec: 240 },
      { title: 'Stabilizer', sec: 60 },
    ],
    note: 'Color, Revealed in Light.',
  },
  {
    slot: 5,
    name: 'B&W Reversal',
    process: 'BWR',
    temperatureC: 20,
    rpm: 60,
    steps: [
      { title: 'First developer', sec: 600 },
      { title: 'Wash', sec: 120 },
      { title: 'Bleach', sec: 300 },
      { title: 'Wash', sec: 120 },
      { title: 'Clearing', sec: 120 },
      { title: 'Re-develop', sec: 300 },
      { title: 'Fix', sec: 240 },
      { title: 'Wash', sec: 300 },
    ],
    note: 'See Black and White in a New Light.',
  },
]

/** One user-created slot as the list renders it (06 in the shots). */
export const CUSTOM_RECIPE: AppRecipe = {
  slot: 6,
  name: 'Push +1 · HP5',
  process: 'USER',
  temperatureC: 20,
  rpm: 45,
  steps: [
    { title: 'Pre-soak', sec: 60 },
    { title: 'Developer', sec: 660 },
    { title: 'Stop', sec: 30 },
    { title: 'Fix', sec: 300 },
    { title: 'Wash', sec: 600 },
  ],
  note: 'Ilford HP5 @ 800 · dilute 1+1',
}

export const C41 = BUILTIN_RECIPES[1]

export function totalSec(r: AppRecipe): number {
  return r.steps.reduce((a, s) => a + s.sec, 0)
}

/** mm:ss, or h:mm:ss past an hour — same rule as the app's fmt(). */
export function fmtClock(sec: number): string {
  const s = Math.max(0, sec)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const rest = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(rest)}` : `${pad(m)}:${pad(rest)}`
}

/** Minutes label used by the recipe rows ("20 MIN"). */
export function minutesLabel(sec: number): number {
  return Math.round(sec / 60)
}
