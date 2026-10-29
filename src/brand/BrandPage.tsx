import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useDocumentMeta, useReveal } from '../link/Stage'
import { href } from '../router'
import { brandImg } from './media'
import BrandHero from './sections/Hero'
import Origin from './sections/Origin'
import Refine from './sections/Refine'
import Process from './sections/Process'
import Practice from './sections/Practice'
import Closing from './sections/Closing'

/**
 * The brand home: one continuous narrative from rotation to product.
 * Technical material (specs, firmware, install, docs) moved to /r1 so this
 * page never has to hedge between storytelling and support links.
 */
export default function BrandPage() {
  const { t, i18n } = useTranslation()
  const revealRef = useReveal<HTMLDivElement>()

  const meta = useMemo(() => {
    const origin = window.location.origin
    return {
      title: t('brand.meta.title'),
      description: t('brand.meta.description'),
      ogTitle: t('brand.meta.ogTitle'),
      ogDescription: t('brand.meta.ogDescription'),
      ogImage: `${origin}${brandImg('og.png')}`,
      canonical: `${origin}${href('/')}`,
    }
    // Re-run when the language changes so the meta follows the copy.
  }, [t, i18n.language])

  useDocumentMeta(meta)

  return (
    <div className="bd" ref={revealRef}>
      <Nav />
      <main>
        <BrandHero />
        <Origin />
        <Refine />
        <Process />
        <Practice />
        <Closing />
      </main>
      <Footer credits />
    </div>
  )
}
