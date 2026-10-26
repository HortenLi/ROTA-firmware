import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RELEASES_API, RELEASES_URL } from '../content'

interface ReleaseAsset {
  id?: number
  name: string
  size: number
  browser_download_url: string
}

interface Release {
  id: number
  tag_name: string
  name: string | null
  body: string | null
  prerelease: boolean
  published_at: string | null
  html_url: string
  assets: ReleaseAsset[]
  zipball_url: string
}

type State =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error' }
  | { kind: 'ready'; releases: Release[] }

function fmtSize(bytes: number, sizeLabel: string): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} ${sizeLabel}`
}

function fmtDate(iso: string | null, lang: string): string {
  if (!iso) return ''
  try {
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}

function AssetRow({
  name,
  size,
  url,
  sizeLabel,
  downloadLabel,
}: {
  name: string
  size: number
  url: string
  sizeLabel: string
  downloadLabel: string
}) {
  return (
    <div className="asset-row">
      <span className="asset-name">{name}</span>
      <span className="asset-meta">
        {sizeLabel} {fmtSize(size, '')}
      </span>
      <a className="asset-dl" href={url} target="_blank" rel="noreferrer">
        {downloadLabel}
      </a>
    </div>
  )
}

function Notes({ body }: { body: string }) {
  const { t } = useTranslation()
  return (
    <div className="rel-notes">
      <span className="notes-tag">{t('firmware.notesOriginal')}</span>
      {body}
    </div>
  )
}

export default function Firmware() {
  const { t, i18n } = useTranslation()
  const [state, setState] = useState<State>({ kind: 'loading' })

  const load = useCallback(async () => {
    setState({ kind: 'loading' })
    try {
      const res = await fetch(RELEASES_API, {
        headers: { Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as Release[]
      setState(data.length === 0 ? { kind: 'empty' } : { kind: 'ready', releases: data })
    } catch {
      setState({ kind: 'error' })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const latest = state.kind === 'ready' ? state.releases[0] : null
  const history = state.kind === 'ready' ? state.releases.slice(1) : []

  return (
    <section className="block" id="firmware">
      <div className="wrap">
        <span className="eyebrow">{t('firmware.eyebrow')}</span>
        <h2 className="sec-title">{t('firmware.title')}</h2>
        <p className="lede-p">{t('firmware.intro')}</p>

        {state.kind === 'loading' && (
          <div className="rel-state" role="status">
            <h3>{t('firmware.title')}</h3>
            <p>{t('firmware.loading')}</p>
          </div>
        )}

        {state.kind === 'empty' && (
          <div className="rel-state" role="status">
            <h3>{t('firmware.emptyTitle')}</h3>
            <p>{t('firmware.emptyBody')}</p>
          </div>
        )}

        {state.kind === 'error' && (
          <div className="rel-state" role="alert">
            <h3>{t('firmware.errorTitle')}</h3>
            <p>{t('firmware.errorBody')}</p>
            <button className="btn btn-ghost" onClick={() => void load()}>
              {t('firmware.retry')}
            </button>
          </div>
        )}

        {latest && (
          <div className="rel-card">
            <div className="head">
              <span className="eyebrow" style={{ marginBottom: 0 }}>
                {t('firmware.latest')}
              </span>
              <span className="rel-tag">{latest.tag_name}</span>
              {latest.prerelease && (
                <span className="pre-badge">{t('firmware.prerelease')}</span>
              )}
              <span className="rel-date">
                {t('firmware.published')} · {fmtDate(latest.published_at, i18n.language)}
              </span>
            </div>
            {latest.body && <Notes body={latest.body} />}
            <div className="rel-assets">
              <span className="notes-tag" style={{ marginBottom: 0 }}>
                {t('firmware.assets')}
              </span>
              {latest.assets.map((a) => (
                <AssetRow
                  key={a.id ?? a.name}
                  name={a.name}
                  size={a.size}
                  url={a.browser_download_url}
                  sizeLabel={t('firmware.size')}
                  downloadLabel={t('firmware.download')}
                />
              ))}
              <AssetRow
                name={t('firmware.sourceCode')}
                size={0}
                url={latest.zipball_url}
                sizeLabel=""
                downloadLabel={t('firmware.download')}
              />
            </div>
          </div>
        )}

        {history.length > 0 && (
          <>
            <h2
              className="sec-title"
              style={{ fontSize: 'clamp(20px, 3vw, 26px)', marginTop: 52 }}
            >
              {t('firmware.history')}
            </h2>
            <div>
              {history.map((r) => (
                <div className="hist-item" key={r.id}>
                  <div className="hist-row">
                    <span className="rel-tag">{r.tag_name}</span>
                    {r.prerelease && (
                      <span className="pre-badge">{t('firmware.prerelease')}</span>
                    )}
                    <span className="rel-date">{fmtDate(r.published_at, i18n.language)}</span>
                    <a
                      className="asset-meta"
                      href={r.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub ↗
                    </a>
                  </div>
                  {r.body && <div className="hist-notes">{r.body}</div>}
                </div>
              ))}
            </div>
          </>
        )}

        <p className="fw-foot">
          <a href={RELEASES_URL} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
            {t('firmware.viewAll')} ↗
          </a>
        </p>
      </div>
    </section>
  )
}
