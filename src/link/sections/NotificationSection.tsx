import { useTranslation } from 'react-i18next'
import { NotificationCard } from '../AppUI'
import { Stage } from '../Stage'

/**
 * Section 03 — the notification. Not a marketing "smart alert": the actual
 * persistent card, shot in the shade, collapsed and expanded.
 *
 * The ground itself is the point: the app paints no surface at all (v0.16.16),
 * so the card inherits the shade's material and swaps only its ink — #1B1B1B
 * for light, #F2F2EC for dark (res/values{,-night}/colors.xml). The panel is
 * lit on the left and dark on the right to show exactly that.
 */
export default function NotificationSection() {
  const { t } = useTranslation()
  const facts = [1, 2, 3, 4].map((i) => ({ t: t(`link.notif.f${i}t`), d: t(`link.notif.f${i}d`) }))

  return (
    <section className="lk-sec" id="notification">
      <div className="lk-wrap">
        <div className="lk-head" data-reveal>
          <span className="lk-kicker">{t('link.notif.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.notif.title')}</h2>
          <p className="lk-lede">{t('link.notif.body')}</p>
        </div>

        <div className="lk-shade" data-reveal>
          <span className="lk-shade-grip" aria-hidden="true" />
          <div className="lk-shade-cards">
            <figure className="lk-notif">
              <div className="lk-notif-plate">
                <Stage width={390}>
                  <NotificationCard theme="light" />
                </Stage>
              </div>
              <figcaption>
                <span className="lk-detail-k">{t('link.notif.collapsedK')}</span>
                <span className="lk-detail-v">{t('link.notif.collapsedV')}</span>
              </figcaption>
            </figure>

            <figure className="lk-notif">
              <div className="lk-notif-plate">
                <Stage width={390}>
                  <NotificationCard theme="dark" expanded />
                </Stage>
              </div>
              <figcaption>
                <span className="lk-detail-k">{t('link.notif.expandedK')}</span>
                <span className="lk-detail-v">{t('link.notif.expandedV')}</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <dl className="lk-facts is-2x2" data-reveal>
          {facts.map((f) => (
            <div className="lk-fact" key={f.t}>
              <dt>{f.t}</dt>
              <dd>{f.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
