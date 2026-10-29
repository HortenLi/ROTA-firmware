import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Firmware from './sections/Firmware'
import { About, Docs, Install, Intro, Specs } from './sections/Content'
import LinkPage from './link/LinkPage'
import { LINK_PATH, useRoute } from './router'

const HOME_TITLE = 'ROTA — Film Roller Processor'
const HOME_DESC = 'ROTA Film Roller Processor — firmware releases, updates, and documentation.'

export default function App() {
  const { i18n } = useTranslation()
  const route = useRoute()

  // Keep <html lang> in sync (drives per-language font stacks in CSS).
  useEffect(() => {
    document.documentElement.lang = i18n.language.toLowerCase()
  }, [i18n.language])

  // Restore the home metadata when leaving the product page.
  useEffect(() => {
    if (route.path === LINK_PATH) return
    document.title = HOME_TITLE
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', HOME_DESC)
  }, [route.path])

  if (route.path === LINK_PATH) {
    return <LinkPage />
  }

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Specs />
        <Firmware />
        <Install />
        <Docs />
        <About />
      </main>
      <Footer />
    </>
  )
}
