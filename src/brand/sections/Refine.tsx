import { useTranslation } from 'react-i18next'
import { brandImg } from '../media'
import { MechPlate } from '../Dial'

const PILLARS = ['p1', 'p2', 'p3'] as const

/** 03 — Philosophy: tradition held next to the refinement, not against it. */
export default function Refine() {
  const { t } = useTranslation()
  return (
    <section className="bd-sec bd-sec--warm bd-refine" id="refine">
      <div className="bd-shell">
        <header className="bd-head">
          <p className="bd-kicker" data-reveal>
            {t('brand.refine.kicker')}
          </p>
          <div className="bd-head-row">
            <h2 className="bd-h2" data-reveal>
              {t('brand.refine.title')}
            </h2>
            <p className="bd-lede" data-reveal>
              {t('brand.refine.lede')}
            </p>
          </div>
        </header>

        <div className="bd-pair">
          <div className="bd-pair-col" data-reveal>
            <figure>
              <img
                src={brandImg('refine-tradition.webp')}
                alt={t('brand.refine.capLeft')}
                width={860}
                height={1075}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <p className="bd-cap">{t('brand.refine.capLeft')}</p>
            <div className="bd-pair-text">
              <h3>{t('brand.refine.leftKicker')}</h3>
              <p>{t('brand.refine.leftBody')}</p>
            </div>
          </div>

          <div className="bd-pair-col bd-pair-col--plate" data-reveal>
            <MechPlate
              labels={[
                { k: t('brand.refine.plateRange'), v: t('brand.hero.rail1v') },
                { k: t('brand.refine.plateTemp'), v: t('brand.hero.rail2v') },
                { k: t('brand.refine.plateSteps'), v: t('brand.practice.r1f3v') },
              ]}
            />
            <p className="bd-cap">{t('brand.refine.capRight')}</p>
            <div className="bd-pair-text">
              <h3>{t('brand.refine.rightKicker')}</h3>
              <p>{t('brand.refine.rightBody')}</p>
            </div>
          </div>
        </div>

        <dl className="bd-pillars">
          {PILLARS.map((p) => (
            <div key={p} data-reveal>
              <dt>{t(`brand.refine.${p}k`)}</dt>
              <dd>{t(`brand.refine.${p}d`)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
