import { useTranslation } from 'react-i18next'
import { Phone, TimerHome } from '../AppUI'
import { Stage } from '../Stage'

/**
 * Section 01 — the first screen. Dark studio, oversized product name, and the
 * real timer at the highest possible fidelity: this must read as a product
 * photograph of an app, not as a marketing illustration.
 */
export default function Hero() {
  const { t } = useTranslation()
  const specs = [1, 2, 3, 4].map((i) => ({
    k: t(`link.hero.spec${i}k`),
    v: t(`link.hero.spec${i}v`),
  }))
  return (
    <section className="lk-hero" id="top">
      <div className="lk-wrap lk-hero-grid">
        <div className="lk-hero-copy">
          <span className="lk-kicker lk-kicker-brass">{t('link.hero.eyebrow')}</span>
          <h1 className="lk-hero-title">ROTA Link</h1>
          <p className="lk-hero-tag">{t('link.hero.tagline')}</p>
          <p className="lk-hero-lede">{t('link.hero.lede')}</p>
          <div className="lk-cta">
            <a className="lk-btn lk-btn-paper" href="#start">
              {t('link.hero.ctaApp')}
            </a>
            <a className="lk-btn lk-btn-ghost" href="#connected">
              {t('link.hero.ctaHw')}
            </a>
          </div>
        </div>

        <div className="lk-hero-figure">
          <div className="lk-hero-glow" aria-hidden="true" />
          <Phone>
            <Stage width={390} height={844}>
              <TimerHome linked={false} offset={219} />
            </Stage>
          </Phone>
          <div className="lk-figcap">
            <span className="lk-figcap-rule" aria-hidden="true" />
            {t('link.hero.figureCaption')}
          </div>
        </div>
      </div>

      <div className="lk-specstrip">
        {specs.map((s) => (
          <div className="lk-spec" key={s.k}>
            <span className="lk-spec-k">{s.k}</span>
            <span className="lk-spec-v">{s.v}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
