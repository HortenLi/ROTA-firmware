import { useTranslation } from 'react-i18next'
import { AlertPlate, type AlertLevel } from '../AppUI'
import { SpeakerIcon } from '../icons'
import { Stage } from '../Stage'

/**
 * Section 02 — reminders. Two halves, because a reminder is two things:
 * what you see, and what you hear.
 *
 * The colours, timings and beeps are transcribed from `TimerAlert.kt`,
 * `TimerFullscreen.kt` and `TimerAlerts.kt` (v0.16). Nothing here is a
 * decorative "notification bell" — every row is one of the six patterns the
 * SoundPool actually plays, on the same 1.6 s ruler.
 */

type Beat = { at: number; dur: number; khz: number }
type Row = { level: AlertLevel; sec: number; pct: number }

const LEVELS: Row[] = [
  { level: 'warm', sec: 10, pct: 46.2 },
  { level: 'approach', sec: 4, pct: 86.4 },
  { level: 'overtime', sec: 12, pct: 100 },
]

/** 1.6 s of track; bar height maps 1.5 → 3.0 kHz. */
const TRACK_MS = 1600
const SOUNDS: Beat[][] = [
  [{ at: 0, dur: 80, khz: 1.8 }, { at: 180, dur: 80, khz: 1.8 }],
  [{ at: 0, dur: 60, khz: 2.5 }],
  [
    { at: 0, dur: 60, khz: 2.5 },
    { at: 400, dur: 60, khz: 2.5 },
    { at: 800, dur: 60, khz: 2.5 },
    { at: 1200, dur: 60, khz: 2.5 },
  ],
  [{ at: 0, dur: 1500, khz: 2.5 }],
  [{ at: 0, dur: 100, khz: 1.8 }, { at: 120, dur: 100, khz: 2.2 }],
  [{ at: 0, dur: 100, khz: 2.2 }, { at: 200, dur: 100, khz: 2.2 }],
  [
    { at: 0, dur: 110, khz: 2.0 },
    { at: 170, dur: 110, khz: 2.5 },
    { at: 340, dur: 160, khz: 3.0 },
  ],
]

export default function RemindersSection() {
  const { t } = useTranslation()

  return (
    <section className="lk-sec lk-sec-warm" id="reminders">
      <div className="lk-wrap">
        <div className="lk-head" data-reveal>
          <span className="lk-kicker">{t('link.remind.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.remind.title')}</h2>
          <p className="lk-lede">{t('link.remind.body')}</p>
        </div>

        <div className="lk-levels" data-reveal>
          {LEVELS.map((row, i) => (
            <figure className="lk-level" key={row.level}>
              <div className="lk-level-plate">
                <Stage width={390}>
                  <AlertPlate level={row.level} sec={row.sec} pct={row.pct} />
                </Stage>
              </div>
              <figcaption>
                <span className="lk-level-k">
                  {i + 1} · {t(`link.remind.l${i + 1}k`)}
                </span>
                <span className="lk-level-v">{t(`link.remind.l${i + 1}v`)}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="lk-sound" data-reveal>
          <div className="lk-sound-head">
            <h3 className="lk-h3">{t('link.remind.soundTitle')}</h3>
            <p className="lk-sound-note">{t('link.remind.soundNote')}</p>
          </div>

          <div className="lk-sound-list">
            {SOUNDS.map((beats, i) => (
              <div className="lk-sound-row" key={i}>
                <span className="lk-sound-m">{t(`link.remind.s${i + 1}m`)}</span>
                <span className="lk-sound-track" aria-hidden="true">
                  {beats.map((b, k) => (
                    <i
                      key={k}
                      style={{
                        left: `${(b.at / TRACK_MS) * 100}%`,
                        width: `max(${(b.dur / TRACK_MS) * 100}%, 3px)`,
                        height: `${((b.khz - 1.5) / 1.5) * 100}%`,
                      }}
                    />
                  ))}
                </span>
                <span className="lk-sound-v">{t(`link.remind.s${i + 1}v`)}</span>
              </div>
            ))}
          </div>

          <p className="lk-sound-foot">
            <span className="lk-sound-mute" aria-hidden="true">
              <SpeakerIcon size={15} on={false} />
            </span>
            {t('link.remind.soundFoot')}
          </p>
        </div>
      </div>
    </section>
  )
}
