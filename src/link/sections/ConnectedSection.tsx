import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ConnectAsk, ConnectCard, LinkEntryMark, TabBar } from '../AppUI'
import { Stage } from '../Stage'

/**
 * Chapter 05 — the machine is an accessory, not a requirement.
 *
 * Three beats, in the order the app itself tells the story: the one question it
 * ever asks (and the answer "not now" that it remembers), what actually leaves
 * the interface when you give that answer, and the same timer running in both
 * states. Nothing here is a mock-up of a feature we are promising — every state
 * below is a branch that exists in `MainActivity.kt` today.
 */
export default function ConnectedSection() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'solo' | 'linked'>('solo')
  return (
    <section className="lk-connect lkx-connect" id="connected">
      <div className="lk-wrap lk-head lk-head-connect lkx-head" data-reveal>
        <span className="lk-kicker">{t('link.connected.eyebrow')}</span>
        <h2 className="lk-h2">{t('link.connected.title')}</h2>
        <p className="lk-lede">{t('link.connected.body')}</p>
      </div>

      <div className="lk-wrap lkx-device">
        <div className="lkx-device-col" data-reveal>
          <span className="lkx-col-cap"><i>A</i>{t('link.connected.askKicker')}</span>
          <div className="lkx-ask-sheet">
            <Stage width={390}><ConnectAsk /></Stage>
          </div>
          <p className="lkx-col-note">{t('link.connected.askCap')}</p>

          <div className="lkx-entry">
            <span className="lkx-navdiff-label">{t('link.connected.entryLabel')}</span>
            <div className="lkx-entry-row">
              <figure>
                <LinkEntryMark state="icon" />
                <figcaption>{t('link.connected.entrySolo')}</figcaption>
              </figure>
              <figure>
                <LinkEntryMark state="linked" />
                <figcaption>{t('link.connected.entryLive')}</figcaption>
              </figure>
            </div>
          </div>
        </div>

        <div className="lkx-device-col" data-reveal>
          <span className="lkx-col-cap"><i>B</i>{t('link.connected.leaveKicker')}</span>

          <div className="lkx-navdiff">
            <div className="lkx-navdiff-row" data-state="solo">
              <span className="lkx-navdiff-label">{t('link.connected.navSolo')}</span>
              <div className="lkx-navdiff-bar">
                <Stage width={390} height={70}><TabBar active="TIMER" hasDevice={false} /></Stage>
              </div>
            </div>
            <div className="lkx-navdiff-row" data-state="linked">
              <span className="lkx-navdiff-label">{t('link.connected.navLinked')}</span>
              <div className="lkx-navdiff-bar">
                <Stage width={390} height={70}><TabBar active="TIMER" hasDevice /></Stage>
              </div>
            </div>
          </div>

          <ul className="lkx-leave">
            <li>{t('link.connected.leaveB1')}</li>
            <li>{t('link.connected.leaveB2')}</li>
            <li>{t('link.connected.leaveB3')}</li>
          </ul>
          <p className="lkx-col-note">{t('link.connected.navNote')}</p>
        </div>
      </div>

      <div className="lk-wrap lkx-connect-switch" role="group" aria-label={t('link.connected.eyebrow')}>
        <button type="button" className={mode === 'solo' ? 'on' : ''} aria-pressed={mode === 'solo'} onClick={() => setMode('solo')}>{t('link.connected.leftKicker')}</button>
        <button type="button" className={mode === 'linked' ? 'on' : ''} aria-pressed={mode === 'linked'} onClick={() => setMode('linked')}>{t('link.connected.rightKicker')}</button>
      </div>

      <div className="lk-split" data-mode={mode}>
        <div className="lk-half lk-half-light">
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
            <div className="lk-half-card"><Stage width={390}><ConnectCard linked={false} /></Stage></div>
          </div>
        </div>

        <div className="lk-half lk-half-ink">
          <span className="lk-kicker lk-kicker-brass">{t('link.connected.rightKicker')}</span>
          <div className="lk-half-grid">
            <div>
              <h3 className="lk-h3">{t('link.connected.rightTitle')}</h3>
              <p className="lk-lede">{t('link.connected.rightBody')}</p>
              <ul className="lk-list">
                <li>{t('link.connected.rightB1')}</li>
                <li>{t('link.connected.rightB2')}</li>
                <li className="pending">{t('link.connected.rightB3')}<span className="lk-chip">{t('link.app.pending')}</span></li>
              </ul>
            </div>
            <div className="lk-half-card"><Stage width={390}><ConnectCard linked /></Stage></div>
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
