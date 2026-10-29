import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BrandPage from './brand/BrandPage'
import LinkPage from './link/LinkPage'
import R1Page from './sections/R1Page'
import { LINK_PATH, R1_PATH, useRoute } from './router'

export default function App() {
  const { i18n } = useTranslation()
  const route = useRoute()

  // Keep <html lang> in sync (drives per-language font stacks in CSS).
  useEffect(() => {
    document.documentElement.lang = i18n.language.toLowerCase()
  }, [i18n.language])

  if (route.path === LINK_PATH) return <LinkPage />
  if (route.path === R1_PATH) return <R1Page />
  return <BrandPage />
}
