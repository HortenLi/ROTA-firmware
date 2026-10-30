import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from '../components/Nav'
import { href } from '../router'
import { useDocumentMeta, useReveal } from './Stage'
import Hero from './sections/Hero'
import FlowSection from './sections/FlowSection'
import TimerSection from './sections/TimerSection'
import RemindersSection from './sections/RemindersSection'
import NotificationSection from './sections/NotificationSection'
import RecipesSection from './sections/RecipesSection'
import WorkflowSection from './sections/WorkflowSection'
import FilmLogSection from './sections/FilmLogSection'
import ConnectedSection from './sections/ConnectedSection'
import AnalogSection from './sections/AnalogSection'
import DownloadSection from './sections/DownloadSection'
import LinkFooter from './sections/LinkFooter'

/**
 * ROTA Link product page. One vertical narrative:
 * brand → how it starts → timer → reminders → notification → recipes →
 * workflow → film log → connection → material → download.
 */
export default function LinkPage() {
  const { t, i18n } = useTranslation()

  const meta = useMemo(() => {
    const origin = window.location.origin
    // Pages serves this route from `link/index.html`, i.e. with a trailing
    // slash — point the canonical at the URL that actually answers 200.
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
        <TimerSection />
        <RemindersSection />
        <NotificationSection />
        <RecipesSection />
        <WorkflowSection />
        <FilmLogSection />
        <ConnectedSection />
        <AnalogSection />
        <DownloadSection />
      </main>
      <LinkFooter />
    </div>
  )
}
