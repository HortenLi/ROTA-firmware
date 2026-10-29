import { useTranslation } from 'react-i18next'

/**
 * Section 04 — why ROTA exists, in the author's own words.
 *
 * No product render here: there is no confirmed product photography yet, and
 * the brief is explicit that a generic PCB or machine-shop photo must not be
 * passed off as development material. A hairline ring carries the motif
 * instead, and the words do the rest.
 */
export default function Why() {
  const { t } = useTranslation()
  return (
    <section className="bd-sec bd-sec--warm pr-why" id="why">
      <div className="bd-shell pr-why-in">
        <div className="pr-why-copy">
          <p className="bd-kicker" data-reveal>
            {t('person.why.kicker')}
          </p>
          <h2 className="bd-h2" data-reveal>
            {t('person.why.title')}
          </h2>
          <div className="pr-why-body">
            {[1, 2, 3].map((i) => (
              <p key={i} data-reveal>
                {t(`person.why.p${i}`)}
              </p>
            ))}
          </div>
        </div>

        <div className="pr-why-art" aria-hidden="true" data-reveal>
          <span className="pr-ring pr-ring--outer" />
          <span className="pr-ring pr-ring--inner" />
          <span className="pr-ring-dot" />
        </div>
      </div>
    </section>
  )
}
