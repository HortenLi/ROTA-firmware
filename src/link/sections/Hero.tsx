import { useTranslation } from 'react-i18next'
import { Phone, TimerHome } from '../AppUI'
import { Stage } from '../Stage'

export default function Hero() {
  const { t } = useTranslation()
  const specs = [1, 2, 3].map((i) => ({
    k: t(`link.hero.spec${i}k`),
    v: t(`link.hero.spec${i}v`),
  }))
  return (
    <section className="lk-hero lkx-hero" id="top">
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
            <a className="lk-btn lk-btn-ghost" href="#download">
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
          <div className="lk-hero-spec" key={s.k}>
            <span className="lk-spec-k">{s.k}</span>
            <span className="lk-spec-v">{s.v}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
