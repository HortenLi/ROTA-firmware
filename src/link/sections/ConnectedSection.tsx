import { useTranslation } from 'react-i18next'
import { ConnectCard } from '../AppUI'
import { Stage } from '../Stage'

/**
 * Section 05 — connected. A literal split screen: the same timer on both sides,
 * only the link state differs. The right-hand readings are blank on purpose —
 * the device-link protocol does not report them yet, and the app says so.
 */
export default function ConnectedSection() {
  const { t } = useTranslation()
  return (
    <section className="lk-connect" id="connected">
      <div className="lk-wrap lk-head lk-head-connect" data-reveal>
        <span className="lk-kicker">{t('link.connected.eyebrow')}</span>
        <h2 className="lk-h2">{t('link.connected.title')}</h2>
        <p className="lk-lede">{t('link.connected.body')}</p>
      </div>

      <div className="lk-split">
        <div className="lk-half lk-half-light" data-reveal>
          <span className="lk-kicker">{t('link.connected.leftKicker')}</span>
          <div className="lk-half-grid">
            <div>
              <h3 className="lk-h3">{t('link.connected.leftTitle')}</h3>
              <p className="lk-lede">{t('link.connected.leftBody')}</p>
              <ul className="lk-list">
                <li>{t('link.connected.leftB1')}</li>
                <li>{t('link.connected.leftB2')}</li>
                <li>{t('link.connected.leftB3')}</li>
              </ul>
            </div>
            <div className="lk-half-card">
              <Stage width={390}>
                <ConnectCard linked={false} />
              </Stage>
            </div>
          </div>
        </div>

        <div className="lk-half lk-half-ink" data-reveal>
          <span className="lk-kicker lk-kicker-brass">{t('link.connected.rightKicker')}</span>
          <div className="lk-half-grid">
            <div>
              <h3 className="lk-h3">{t('link.connected.rightTitle')}</h3>
              <p className="lk-lede">{t('link.connected.rightBody')}</p>
              <ul className="lk-list">
                <li>{t('link.connected.rightB1')}</li>
                <li>{t('link.connected.rightB2')}</li>
                <li className="pending">
                  {t('link.connected.rightB3')}
                  <span className="lk-chip">{t('link.app.pending')}</span>
                </li>
              </ul>
            </div>
            <div className="lk-half-card">
              <Stage width={390}>
                <ConnectCard linked />
              </Stage>
            </div>
          </div>
        </div>
      </div>

      <div className="lk-honest">
        <div className="lk-wrap lk-honest-inner">
          <span className="lk-chip lk-chip-dark">{t('link.app.pending')}</span>
          <p>{t('link.connected.honest')}</p>
        </div>
      </div>
    </section>
  )
}
