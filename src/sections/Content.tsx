import { useTranslation } from 'react-i18next'
import { REPO_URL } from '../content'

export function Intro() {
  const { t } = useTranslation()
  return (
    <section className="block" id="product">
      <div className="wrap">
        <span className="eyebrow">{t('intro.eyebrow')}</span>
        <h2 className="sec-title">{t('intro.title')}</h2>
        <p className="lede-p">{t('intro.body1')}</p>
        <p className="lede-p">{t('intro.body2')}</p>
        <div className="feat-grid">
          <div className="feat">
            <h3>{t('intro.f1t')}</h3>
            <p>{t('intro.f1d')}</p>
          </div>
          <div className="feat">
            <h3>{t('intro.f2t')}</h3>
            <p>{t('intro.f2d')}</p>
          </div>
          <div className="feat">
            <h3>{t('intro.f3t')}</h3>
            <p>{t('intro.f3d')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Specs() {
  const { t } = useTranslation()
  const rows: Array<[string, string]> = [
    [t('specs.rows.controller'), t('specs.rows.controllerV')],
    [t('specs.rows.wireless'), t('specs.rows.wirelessV')],
    [t('specs.rows.display'), t('specs.rows.displayV')],
    [t('specs.rows.rotation'), t('specs.rows.rotationV')],
    [t('specs.rows.temperature'), t('specs.rows.temperatureV')],
    [t('specs.rows.recipes'), t('specs.rows.recipesV')],
    [t('specs.rows.updates'), t('specs.rows.updatesV')],
  ]
  return (
    <section className="block" id="specs">
      <div className="wrap">
        <span className="eyebrow">{t('specs.eyebrow')}</span>
        <h2 className="sec-title">{t('specs.title')}</h2>
        <table className="spec-table">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="spec-note">{t('specs.note')}</p>
      </div>
    </section>
  )
}

export function Install() {
  const { t } = useTranslation()
  const steps: Array<[string, string]> = [
    [t('install.s1t'), t('install.s1d')],
    [t('install.s2t'), t('install.s2d')],
    [t('install.s3t'), t('install.s3d')],
    [t('install.s4t'), t('install.s4d')],
  ]
  return (
    <section className="block" id="install">
      <div className="wrap">
        <span className="eyebrow">{t('install.eyebrow')}</span>
        <h2 className="sec-title">{t('install.title')}</h2>
        <div className="steps">
          {steps.map(([h, d]) => (
            <div className="step" key={h}>
              <h3>{h}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="install-warn">
          <span className="tag">⚠</span>
          <span>{t('install.warn')}</span>
        </div>
      </div>
    </section>
  )
}

export function Docs() {
  const { t } = useTranslation()
  const cards: Array<{ title: string; desc: string; href: string }> = [
    { title: t('docs.d1t'), desc: t('docs.d1d'), href: REPO_URL },
    {
      title: t('docs.d2t'),
      desc: t('docs.d2d'),
      href: `${REPO_URL}/releases`,
    },
    { title: t('docs.d3t'), desc: t('docs.d3d'), href: `${REPO_URL}#readme` },
  ]
  return (
    <section className="block" id="docs">
      <div className="wrap">
        <span className="eyebrow">{t('docs.eyebrow')}</span>
        <h2 className="sec-title">{t('docs.title')}</h2>
        <div className="doc-grid">
          {cards.map((c) => (
            <a
              className="doc-card"
              key={c.title}
              href={c.href}
              target="_blank"
              rel="noreferrer"
            >
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <span className="open">{t('docs.open')} ↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function About() {
  const { t } = useTranslation()
  return (
    <section className="block" id="about">
      <div className="wrap">
        <span className="eyebrow">{t('about.eyebrow')}</span>
        <h2 className="sec-title">{t('about.title')}</h2>
        <p className="about-body">{t('about.body')}</p>
      </div>
    </section>
  )
}
