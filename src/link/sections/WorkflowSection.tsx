import { useTranslation } from 'react-i18next'
import { C41, fmtClock, totalSec } from '../appData'
import { useProcessClock } from '../Stage'

/**
 * Section 04 — workflow. Not a dashboard: one process, five steps, and the
 * three questions a person actually asks during a run. The rail is a ruler —
 * equal columns, brass for the step in progress.
 */
export default function WorkflowSection() {
  const { t } = useTranslation()
  const clock = useProcessClock(C41.steps, 219)
  const status = (i: number) =>
    i < clock.stage
      ? t('link.workflow.statusDone')
      : i === clock.stage
        ? t('link.workflow.statusNow')
        : i === clock.stage + 1
          ? t('link.workflow.statusNext')
          : t('link.workflow.statusLater')

  return (
    <section className="lk-sec lk-sec-ink" id="workflow">
      <div className="lk-wrap">
        <div className="lk-head" data-reveal>
          <span className="lk-kicker">{t('link.workflow.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.workflow.title')}</h2>
          <p className="lk-lede">{t('link.workflow.body')}</p>
        </div>

        <div className="lk-flow" data-reveal>
          <div className="lk-flow-meta">
            <span>
              <i>{t('link.workflow.total')}</i>
              {fmtClock(totalSec(C41))}
            </span>
            <span>
              <i>{t('link.workflow.remaining')}</i>
              {fmtClock(clock.total - clock.elapsed)}
            </span>
            <span>
              <i>{C41.name}</i>
              {String(clock.stage + 1).padStart(2, '0')} / {String(C41.steps.length).padStart(2, '0')}
            </span>
          </div>

          <div className="lk-rail" aria-hidden="true">
            {C41.steps.map((s, i) => (
              <span
                key={s.title}
                className={`lk-rail-seg${i < clock.stage ? ' done' : ''}${i === clock.stage ? ' now' : ''}`}
              >
                <i style={{ width: i < clock.stage ? '100%' : i === clock.stage ? `${(clock.stageFraction * 100).toFixed(1)}%` : '0%' }} />
              </span>
            ))}
          </div>

          <ol className="lk-steps">
            {C41.steps.map((s, i) => (
              <li
                key={s.title}
                className={`lk-step${i < clock.stage ? ' done' : ''}${i === clock.stage ? ' now' : ''}`}
              >
                <span className="lk-step-no">
                  {i < clock.stage ? '✓' : String(i + 1).padStart(2, '0')}
                </span>
                <span className="lk-step-name">{s.title}</span>
                <span className="lk-step-dur">{fmtClock(i === clock.stage ? clock.remaining : s.sec)}</span>
                <span className="lk-step-status">{status(i)}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
