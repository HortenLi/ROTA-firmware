/** Static brand imagery lives in /public/brand (see _brandcopy/grade.py). */
const BASE = import.meta.env.BASE_URL

export const brandImg = (name: string) => `${BASE}brand/${name}`

export type PlateLabel = { k: string; v: string }
