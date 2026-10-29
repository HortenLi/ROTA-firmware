import { useTranslation } from 'react-i18next'

/** Section 02 — typography only, no diagrams, no skill bars. */
export default function Think() {
  const { t } = useTranslation()
  return (
    <section className="bd-sec pr-think" id="approach">
      <div className="bd-shell pr-think-in">
        <header className="pr-think-head">
          <p className="bd-kicker" data-reveal>
            {t('person.think.kicker')}
          </p>
          <h2 className="bd-h2" data-reveal>
            {t('person.think.title')}
          </h2>
        </header>

        <div className="pr-prose">
          {[1, 2, 3].map((i) => (
            <div className="pr-p" key={i} data-reveal>
              <span className="pr-p-num bd-num" aria-hidden="true">
                {String(i).padStart(2, '0')}
              </span>
              <p>{t(`person.think.p${i}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
