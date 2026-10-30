/**
 * Icons transcribed from the app's Canvas drawing code (24-unit grid), so the
 * mock renders the same glyphs instead of a generic icon set.
 * RotaLink/app/src/main/java/com/rota/link/MainActivity.kt (nav + menu)
 * RotaLink/app/src/main/java/com/rota/link/ui/timer/TimerScreen.kt (controls)
 * RotaLink/app/src/main/java/com/rota/link/ui/recipes/RecipesScreen.kt (grip, chevron, trash)
 */
type P = { size?: number; className?: string }

function Svg({ size = 16, className, children }: P & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export const MenuIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
  </Svg>
)

export const ExpandIcon = (p: P) => (
  <Svg {...p}>
    <path d="M13 11 19 5M19 10V5h-5M11 13 5 19M10 19H5v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
)

export const CollapseIcon = (p: P) => (
  <Svg {...p}>
    <path d="M19 5 13 11M13 6v5h5M5 19l6-6M6 13h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
)

export const PlayIcon = (p: P) => (
  <Svg {...p}>
    <path d="M8 5 19 12 8 19Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
  </Svg>
)

export const PlayFillIcon = (p: P) => (
  <Svg {...p}>
    <path d="M8 5 19 12 8 19Z" fill="currentColor" />
  </Svg>
)

export const PauseIcon = (p: P) => (
  <Svg {...p}>
    <path d="M7 5h4v14H7zM15 5h4v14h-4z" fill="currentColor" />
  </Svg>
)

export const SkipIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 5 15 12 5 19Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    <path d="M19 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </Svg>
)

export const StopIcon = (p: P) => (
  <Svg size={16} {...p}>
    <rect x="6" y="6" width="12" height="12" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
  </Svg>
)

export const ChevronIcon = ({ size = 17, className, up }: P & { up?: boolean }) => (
  <Svg size={size} className={className}>
    <g transform={up ? 'rotate(180 12 12)' : undefined}>
      <path d="M6 9 12 15 18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </g>
  </Svg>
)

export const GripIcon = ({ size = 14, className }: P) => (
  <Svg size={size} className={className}>
    <g fill="currentColor">
      <circle cx="7.0" cy="4.4" r="1.6" />
      <circle cx="7.0" cy="12" r="1.6" />
      <circle cx="7.0" cy="19.6" r="1.6" />
      <circle cx="15.6" cy="4.4" r="1.6" />
      <circle cx="15.6" cy="12" r="1.6" />
      <circle cx="15.6" cy="19.6" r="1.6" />
    </g>
  </Svg>
)

export const TrashIcon = (p: P) => (
  <Svg size={21} {...p}>
    <path
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 10v6M14 10v6"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export const TimerNavIcon = (p: P) => (
  <Svg size={22} {...p}>
    <path
      d="M4 13a8 8 0 1 0 16 0 8 8 0 1 0-16 0M12 8v5l3 2M9 2h6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
)

export const BeakerNavIcon = (p: P) => (
  <Svg size={22} {...p}>
    <path
      d="M8 3h8M9 3v6l-5 9c-.8 1.3.1 3 2 3h12c1.9 0 2.8-1.7 2-3l-5-9V3M7 15h10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export const DeviceNavIcon = (p: P) => (
  <Svg size={22} {...p}>
    <path
      d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM9 7h6M9 11h6M9 15h3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

/**
 * Film Log tab (added in v0.16): a document with a folded corner and a photo
 * frame inside — the app draws the same path, sun included.
 */
export const FilmLogNavIcon = (p: P) => (
  <Svg size={22} {...p}>
    <path
      d="M5.5 3.5h8.1l5 5v12h-13.1ZM13.6 3.5v5h5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="8.2" y="11.6" width="7.8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.9 16.8 10.9 14.2 12.6 16.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14.25" cy="13.1" r="1.05" fill="currentColor" />
  </Svg>
)

/** Speaker — solid body, two arcs when audible, one cross when muted. */export const SpeakerIcon = ({ size = 16, className, on = true }: P & { on?: boolean }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3.6 9.2h3l3.8-3.6v12.8l-3.8-3.6h-3Z" fill="currentColor" />
    {on ? (
      <>
        <path d="M13.4 9.4q1.5 2.6 0 5.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16.2 7.2q2.6 4.8 0 9.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ) : (
      <path d="M13.6 9.2 19.4 14.8M19.4 9.2 13.6 14.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    )}
  </svg>
)

/** Status-bar glyphs — deliberately tiny and low-contrast. */
export const WifiGlyph = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
    <path d="M1 3.4a8.4 8.4 0 0 1 11 0M3 5.7a5.4 5.4 0 0 1 7 0M6.5 8.4 6.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const BatteryGlyph = () => (
  <svg width="18" height="9" viewBox="0 0 18 9" fill="none" aria-hidden="true">
    <rect x="0.6" y="0.6" width="14" height="7.8" rx="1.6" stroke="currentColor" strokeWidth="1" opacity="0.55" />
    <rect x="2" y="2" width="9.5" height="5" rx="0.9" fill="currentColor" />
    <path d="M16.2 3.2v2.6a1.6 1.6 0 0 0 0-2.6Z" fill="currentColor" opacity="0.55" />
  </svg>
)
