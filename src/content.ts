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
 *         and public/releases/latest.json — the signed build the in-app updater
 *         actually points at (size, sha256, publish date). The repo can be a few
 *         commits ahead of the published binary; the number here describes the
 *         artefact, not the working tree.
 */
export const APP = {
  name: 'ROTA Link',
  packageId: 'com.rota.link',
  version: '0.16.33',
  build: 72,
  minAndroid: '8.0',
  apkBytes: 36_774_532,
  builtOn: '2026-11-02',
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
