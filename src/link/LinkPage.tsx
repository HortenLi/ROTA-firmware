import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from '../components/Nav'
import { href } from '../router'
import { useDocumentMeta, useReveal } from './Stage'
import Hero from './sections/Hero'
import TimerSection from './sections/TimerSection'
import RecipesSection from './sections/RecipesSection'
import WorkflowSection from './sections/WorkflowSection'
import ConnectedSection from './sections/ConnectedSection'
import AnalogSection from './sections/AnalogSection'
import DownloadSection from './sections/DownloadSection'
import LinkFooter from './sections/LinkFooter'

/**
 * ROTA Link product page. One vertical narrative:
 * brand → timer → recipes → workflow → connection → material → download.
 */
export default function LinkPage() {
  const { t, i18n } = useTranslation()

  const meta = useMemo(() => {
    const origin = window.location.origin
    const canonical = `${origin}${href('/link')}`
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
        <TimerSection />
        <RecipesSection />
        <WorkflowSection />
        <ConnectedSection />
        <AnalogSection />
        <DownloadSection />
      </main>
      <LinkFooter />
    </div>
  )
}
