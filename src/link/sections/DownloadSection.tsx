import { useTranslation } from 'react-i18next'
import { APP, REPO_URL, apkSizeLabel } from '../../content'
import { href } from '../../router'

/**
 * Section 07 — download. Nothing here pretends to be available: while
 * APP.channel is 'preview' and APP.downloadUrl is null, the block states the
 * situation and links to real project pages. Setting a real URL in content.ts
 * turns it into an honest download button — no component change needed.
 */
export default function DownloadSection() {
  const { t } = useTranslation()
  const rows = [
    [t('link.download.version'), `${APP.version} · ${apkSizeLabel(APP.apkBytes)}`],
    [t('link.download.build'), String(APP.build)],
    [t('link.download.built'), APP.builtOn],
    [t('link.download.requires'), t('link.download.androidValue', { v: APP.minAndroid })],
    [t('link.download.distribution'), t('link.download.distributionValue')],
  ]

  const downloadable = APP.channel === 'public' && APP.downloadUrl

  return (
    <section className="lk-sec lk-download" id="download">
      <div className="lk-wrap">
        <div className="lk-head" data-reveal>
          <span className="lk-kicker">{t('link.download.eyebrow')}</span>
          <h2 className="lk-h2">{t('link.download.title')}</h2>
          <p className="lk-lede">{t('link.download.body')}</p>
        </div>

        <div className="lk-dl-grid" data-reveal>
          <div className="lk-dl-facts">
            <dl>
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lk-dl-card">
            <div className="lk-dl-head">
              <img
                className="lk-appicon"
                src={href('/link/app-icon.png')}
                alt={`${APP.name} app icon`}
                width={72}
                height={72}
                loading="lazy"
                decoding="async"
              />
              <div>
                <div className="lk-dl-name">{APP.name}</div>
                <div className="lk-dl-plat">
                  <span>Android</span>
                  <i>{t('link.download.distributionValue')}</i>
                </div>
              </div>
            </div>

            {downloadable ? (
              <a className="lk-btn lk-btn-ink lk-dl-btn" href={APP.downloadUrl!} rel="noreferrer">
                {t('link.download.version')} {APP.version}
              </a>
            ) : (
              <div className="lk-dl-status">
                <strong>{t('link.download.statusTitle')}</strong>
                <p>{t('link.download.statusBody')}</p>
              </div>
            )}

            <div className="lk-dl-links">
              <a href={`${REPO_URL}#readme`} target="_blank" rel="noreferrer">
                {t('link.download.notes')} ↗
              </a>
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                {t('link.download.github')} ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
