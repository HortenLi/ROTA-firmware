import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'
import zhTW from './locales/zh-TW.json'

export const SUPPORTED = ['en', 'zh-CN', 'zh-TW'] as const
export type Lang = (typeof SUPPORTED)[number]

export const LANG_LABELS: Record<Lang, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
}

const STORAGE_KEY = 'rota-lang'

export function savedLang(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return SUPPORTED.includes(v as Lang) ? (v as Lang) : null
  } catch {
    return null
  }
}

export function saveLang(l: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, l)
  } catch {
    /* storage unavailable — session-only preference */
  }
}

/** Browser-language mapping. Fallback only — never overrides a saved preference. */
export function detectBrowserLang(): Lang {
  const langs: readonly string[] =
    navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language]
  for (const raw of langs) {
    const l = (raw || '').toLowerCase()
    if (l.startsWith('zh-hk') || l.startsWith('zh-mo') || l.startsWith('zh-tw') || l.startsWith('zh-hant'))
      return 'zh-TW'
    if (l.startsWith('zh')) return 'zh-CN'
    if (l.startsWith('en')) return 'en'
  }
  return 'en'
}

export function initialLang(): Lang {
  return savedLang() ?? detectBrowserLang()
}

export function applyLangAttr(l: Lang) {
  document.documentElement.lang = l.toLowerCase()
}

void i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'zh-CN': { translation: zhCN },
    'zh-TW': { translation: zhTW },
  },
  lng: initialLang(),
  fallbackLng: 'en',
  supportedLngs: SUPPORTED as unknown as string[],
  interpolation: { escapeValue: false },
  returnEmptyString: false,
})

applyLangAttr(i18next.language as Lang)

/** Switch language: no page reload, scroll position is preserved. */
export async function changeLang(l: Lang) {
  await i18next.changeLanguage(l)
  saveLang(l)
  applyLangAttr(l)
}
