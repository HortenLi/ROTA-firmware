/** `public/person/*` — the author's own photographs (see _profilework/export.py). */
const BASE = import.meta.env.BASE_URL

export const personImg = (name: string) => `${BASE}person/${name}`
