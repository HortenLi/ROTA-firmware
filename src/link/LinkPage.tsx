import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from '../components/Nav'
import { href } from '../router'
import { useDocumentMeta, useReveal } from './Stage'
import Hero from './sections/Hero'
import FlowSection from './sections/FlowSection'
import RemindersSection from './sections/RemindersSection'
import OutOfAppSection from './sections/OutOfAppSection'
import FilmLogSection from './sections/FilmLogSection'
import ConnectedSection from './sections/ConnectedSection'
import AnalogSection from './sections/AnalogSection'
import DownloadSection from './sections/DownloadSection'
import LinkFooter from './sections/LinkFooter'

/** A six-beat product story: run, objects, reminders, archive, R1, preview. */
export default function LinkPage() {
  const { t, i18n } = useTranslation()

  const meta = useMemo(() => {
    const origin = window.location.origin
    const canonical = `${origin}${href('/link')}/`
    const lang = i18n.language
    return {
      title: t('link.meta.title'),
      description: t('link.meta.description'),
      ogTitle: t('link.meta.ogTitle'),
      ogDescription: t('link.meta.ogDescription'),
      ogImage: `${origin}${href(`/link/og-${lang}.png`)}`,
      canonical,
    }
  }, [t, i18n.language])

  useDocumentMeta(meta)
  const root = useReveal<HTMLDivElement>()

  return (
    <div className="lk" ref={root}>
      <Nav />
      <main>
        <Hero />
        <FlowSection />
        <OutOfAppSection />
        <RemindersSection />
        <FilmLogSection />
        <ConnectedSection />
        <AnalogSection />
        <DownloadSection />
      </main>
      <LinkFooter />
    </div>
  )
}
