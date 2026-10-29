import { useTranslation } from 'react-i18next'
import { brandImg } from '../media'

const STEPS = ['s1', 's2', 's3', 's4'] as const

/** 04 — Process: the human half of the craft, in a different light. */
export default function Process() {
  const { t } = useTranslation()
  return (
    <section className="bd-sec bd-sec--ink bd-process" id="process">
      <figure className="bd-band">
        <img
          src={brandImg('process-hands.webp')}
          alt={t('brand.process.bandAlt')}
          width={1900}
          height={1069}
          loading="lazy"
          decoding="async"
        />
        <span className="bd-band-veil" aria-hidden="true" />
        <figcaption className="bd-shell bd-band-cap">
          <p className="bd-kicker">{t('brand.process.kicker')}</p>
          <h2 className="bd-h2">{t('brand.process.title')}</h2>
        </figcaption>
      </figure>

      <div className="bd-shell bd-process-body">
        <p className="bd-lede" data-reveal>
          {t('brand.process.lede')}
        </p>

        <ol className="bd-steps">
          {STEPS.map((s, i) => (
            <li key={s} data-reveal>
              <span className="bd-idx bd-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t(`brand.process.${s}t`)}</h3>
              <p>{t(`brand.process.${s}d`)}</p>
            </li>
          ))}
        </ol>

        <div className="bd-proc-figs">
          <figure aria-hidden="true">
            <img
              src={brandImg('process-tank.webp')}
              alt=""
              width={760}
              height={950}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <figure>
            <img
              src={brandImg('process-strip.webp')}
              alt={t('brand.process.figAlt')}
              width={760}
              height={950}
              loading="lazy"
              decoding="async"
            />
            <figcaption>{t('brand.process.figCap')}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
