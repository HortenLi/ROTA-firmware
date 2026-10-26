import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Firmware from './sections/Firmware'
import { About, Docs, Install, Intro, Specs } from './sections/Content'

export default function App() {
  const { i18n } = useTranslation()

  // Keep <html lang> in sync (drives per-language font stacks in CSS).
  useEffect(() => {
    document.documentElement.lang = i18n.language.toLowerCase()
  }, [i18n.language])

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
