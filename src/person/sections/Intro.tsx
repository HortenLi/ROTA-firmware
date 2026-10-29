import { useTranslation } from 'react-i18next'
import { personImg } from '../media'

/**
 * Section 01 — the only place on the site with a face on it.
 * The portrait is the author out shooting at night, camera on a tripod, graded
 * to a warm monochrome so the person stays separate from the colour gallery
 * below. It is a working photograph, not a founder headshot.
 */
export default function Intro() {
  const { t } = useTranslation()
  return (
    <section className="pr-intro" id="top">
      <div className="bd-shell pr-intro-in">
        <div className="pr-intro-copy">
          <p className="bd-kicker" data-reveal>
            {t('person.intro.kicker')}
          </p>
          <h1 className="bd-display pr-title" data-reveal>
            {t('person.intro.title')}
          </h1>
          <p className="bd-lede" data-reveal>
            {t('person.intro.lede')}
          </p>
          <p className="pr-byline" data-reveal>
            {t('person.intro.byline')}
          </p>
        </div>

        <figure className="pr-portrait" data-reveal>
          <img
            src={personImg('portrait.webp')}
            alt={t('person.intro.alt')}
            width={900}
            height={1125}
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>{t('person.intro.cap')}</figcaption>
        </figure>
      </div>
    </section>
  )
}
