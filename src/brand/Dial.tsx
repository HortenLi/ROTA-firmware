import type { PlateLabel } from './media'

/**
 * The brand's one graphic device: a graduated ring.
 *
 * `Dial` is the hero's engraving — 120 ticks, every tenth one long, turning
 * once every five minutes. It is decoration only, so it is hidden from
 * assistive tech and stopped entirely under `prefers-reduced-motion`.
 */
export function Dial({ className }: { className?: string }) {
  const ticks = Array.from({ length: 120 }, (_, i) => i)
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <g className="bd-dial-rot">
        {ticks.map((i) => {
          const major = i % 10 === 0
          const mid = i % 5 === 0
          const a = (i / 120) * Math.PI * 2 - Math.PI / 2
          const outer = 99
          const inner = major ? 89.5 : mid ? 94 : 96.5
          return (
            <line
              key={i}
              x1={(100 + Math.cos(a) * outer).toFixed(3)}
              y1={(100 + Math.sin(a) * outer).toFixed(3)}
              x2={(100 + Math.cos(a) * inner).toFixed(3)}
              y2={(100 + Math.sin(a) * inner).toFixed(3)}
              strokeWidth={major ? 0.9 : 0.45}
              className={major ? 'bd-tick bd-tick--major' : 'bd-tick'}
            />
          )
        })}
      </g>
      <circle cx="100" cy="100" r="99.2" className="bd-dial-edge" />
      <circle cx="100" cy="100" r="72" className="bd-dial-hair" />
    </svg>
  )
}

/**
 * Plan view used in the philosophy section: a drum seen from above, with the
 * three numbers the chemistry actually cares about underneath. No invented
 * dimensions — every value is a published R1 figure.
 */
export function MechPlate({ labels }: { labels: PlateLabel[] }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i)
  const arc = 2 * Math.PI * 62 * 0.42
  return (
    <figure className="bd-plate">
      <div className="bd-plate-canvas">
        <svg viewBox="0 0 240 240" aria-hidden="true" focusable="false">
          <circle cx="120" cy="120" r="96" className="bd-plate-hair" />
          <circle cx="120" cy="120" r="86" className="bd-plate-hair" />
          <g className="bd-plate-ticks">
            {ticks.map((i) => {
              const a = (i / 72) * Math.PI * 2 - Math.PI / 2
              const long = i % 6 === 0
              return (
                <line
                  key={i}
                  x1={(120 + Math.cos(a) * 86).toFixed(2)}
                  y1={(120 + Math.sin(a) * 86).toFixed(2)}
                  x2={(120 + Math.cos(a) * (long ? 78 : 82)).toFixed(2)}
                  y2={(120 + Math.sin(a) * (long ? 78 : 82)).toFixed(2)}
                  strokeWidth={long ? 0.8 : 0.4}
                  className={long ? 'bd-tick bd-tick--major' : 'bd-tick'}
                />
              )
            })}
          </g>
          <circle cx="120" cy="120" r="62" className="bd-plate-hair" />
          <circle
            cx="120"
            cy="120"
            r="62"
            className="bd-plate-arc"
            strokeDasharray={`${arc} ${2 * Math.PI * 62}`}
            transform="rotate(-90 120 120)"
          />
          <line x1="120" y1="52" x2="120" y2="188" className="bd-plate-axis" />
          <line x1="52" y1="120" x2="188" y2="120" className="bd-plate-axis" />
          <circle cx="120" cy="120" r="2.6" className="bd-plate-dot" />
        </svg>
      </div>
      <figcaption className="bd-plate-legend">
        {labels.map((l) => (
          <div key={l.k}>
            <span>{l.k}</span>
            <span className="bd-num">{l.v}</span>
          </div>
        ))}
      </figcaption>
    </figure>
  )
}
