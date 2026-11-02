import { useTranslation } from 'react-i18next'
import { NotificationCard } from '../AppUI'
import { Stage } from '../Stage'

export default function NotificationPart() {
  const { t } = useTranslation()
  const facts = [1, 2, 3, 4].map((i) => ({ t: t(`link.notif.f${i}t`), d: t(`link.notif.f${i}d`) }))
  return (
    <div className="lkx-notif" id="notification">
      <div className="lk-sub-head lkx-subhead" data-reveal>
        <span className="lk-kicker">{t('link.notif.eyebrow')}</span>
        <h3 className="lk-sub-h">{t('link.notif.title')}</h3>
        <p className="lk-lede">{t('link.notif.body')}</p>
      </div>

      <div className="lk-shade" data-reveal>
        <span className="lk-shade-grip" aria-hidden="true" />
        <div className="lk-shade-cards">
          <figure className="lk-notif">
            <div className="lk-notif-plate"><Stage width={390}><NotificationCard theme="light" /></Stage></div>
            <figcaption><span className="lk-detail-k">{t('link.notif.collapsedK')}</span><span className="lk-detail-v">{t('link.notif.collapsedV')}</span></figcaption>
          </figure>
          <figure className="lk-notif">
            <div className="lk-notif-plate"><Stage width={390}><NotificationCard theme="dark" expanded /></Stage></div>
            <figcaption><span className="lk-detail-k">{t('link.notif.expandedK')}</span><span className="lk-detail-v">{t('link.notif.expandedV')}</span></figcaption>
          </figure>
        </div>
      </div>

      <details className="lkx-details" data-reveal>
        <summary>{t('link.notif.detailToggle')}</summary>
        <dl className="lk-facts is-2x2">
          {facts.map((f) => <div className="lk-fact" key={f.t}><dt>{f.t}</dt><dd>{f.d}</dd></div>)}
        </dl>
      </details>
    </div>
  )
}
