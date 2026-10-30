/** Central place for repo/brand constants used across the site. */
export const REPO_OWNER = 'HortenLi'
export const REPO_NAME = 'ROTA-firmware'
export const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`
export const RELEASES_URL = `${REPO_URL}/releases`
export const RELEASES_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases?per_page=10`

/** Route of the ROTA Link product page (see src/router.tsx). */
export const LINK_PATH = '/link'

/**
 * ROTA Link app facts — copied from the app project, not invented.
 * Source: RotaLink/app/build.gradle.kts (versionName / versionCode / minSdk)
 *         and the signed build ROTA-Link-v0.16.18.apk (size, build date).
 * When the app version changes, update only this block.
 */
export const APP = {
  name: 'ROTA Link',
  packageId: 'com.rota.link',
  version: '0.16.18',
  build: 58,
  minAndroid: '8.0',
  apkBytes: 36_645_963,
  builtOn: '2026-10-31',
  /**
   * 'preview' = signed test builds handed out directly, not on any store.
   * While this is 'preview' the Download section shows status instead of a
   * button — never a dead link.
   */
  channel: 'preview' as 'preview' | 'public',
  /** Set to a real, public artefact URL to turn the Download section into a button. */
  downloadUrl: null as string | null,
}

/** 36 645 963 B → "36.6 MB" (decimal, what a download manager shows). */
export function apkSizeLabel(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`
}
