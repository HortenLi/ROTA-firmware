/** Central place for repo/brand constants used across the site. */
export const REPO_OWNER = 'HortenLi'
export const REPO_NAME = 'ROTA-firmware'
export const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`
export const RELEASES_URL = `${REPO_URL}/releases`
export const RELEASES_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases?per_page=10`

export const NAV_SECTIONS = [
  'product',
  'specs',
  'firmware',
  'install',
  'docs',
  'about',
] as const
