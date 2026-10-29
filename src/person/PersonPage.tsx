import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useDocumentMeta, useReveal } from '../link/Stage'
import { href } from '../router'
import { brandImg } from '../brand/media'
import Intro from './sections/Intro'
import Think from './sections/Think'
import Film from './sections/Film'
import Why from './sections/Why'
import Closing from './sections/Closing'

/**
 * /about — "The Person Behind ROTA".
 *
 * A light personal page, not a résumé and not a portfolio: the portrait opens
 * it, three paragraphs explain how the author thinks, the author's own film
 * photographs carry the middle, and ROTA's own slogan closes it. No timeline,
 * no skill chart, no invented project lore — everything on the page is either
 * copy from the brief or a real photograph.
 */
export default function PersonPage() {
  const { t, i18n } = useTranslation()
  const revealRef = useReveal<HTMLDivElement>()

  const meta = useMemo(() => {
    const origin = window.location.origin
    return {
      title: t('person.meta.title'),
      description: t('person.meta.description'),
      ogTitle: t('person.meta.ogTitle'),
      ogDescription: t('person.meta.ogDescription'),
      ogImage: `${origin}${brandImg('og.png')}`,
      canonical: `${origin}${href('/about')}`,
    }
    // Re-run on language change so the head follows the copy.
  }, [t, i18n.language])

  useDocumentMeta(meta)

  return (
    <div className="bd pr" ref={revealRef}>
      <Nav />
      <main>
        <Intro />
        <Think />
        <Film />
        <Why />
        <Closing />
      </main>
      <Footer />
    </div>
  )
}
