import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Renders a fixed-size "design canvas" (the app is laid out in dp at a 390pt
 * phone width) and scales it down to the container. Transform-scaling keeps
 * text vector-crisp at any DPR and lets every measurement stay a literal copy
 * of the Compose layout — no unit gymnastics, no font-size drift.
 */
export function Stage({
  width,
  height,
  children,
  className,
}: {
  width: number
  height?: number
  children: ReactNode
  className?: string
}) {
  const wrap = useRef<HTMLDivElement | null>(null)
  const inner = useRef<HTMLDivElement | null>(null)
  const [k, setK] = useState(0)
  const [h, setH] = useState(height ?? 0)

  useEffect(() => {
    const w = wrap.current
    const i = inner.current
    if (!w || !i) return
    const measure = () => {
      const cw = w.clientWidth
      if (cw > 0) setK(cw / width)
      if (height === undefined) setH(i.scrollHeight)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(w)
    ro.observe(i)
    return () => ro.disconnect()
  }, [width, height])

  return (
    <div
      className={className}
      ref={wrap}
      style={{ height: h > 0 && k > 0 ? h * k : undefined, overflow: 'hidden' }}
    >
      <div
        ref={inner}
        style={{
          width,
          height,
          transform: `scale(${k || 0.0001})`,
          transformOrigin: 'top left',
          // Avoid a one-frame flash at the unscaled size before the first measure.
          visibility: k > 0 ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Drives the hero countdown from a single elapsed-seconds value, exactly the
 * way the app's TimerEngine does (one clock, stages derived from it).
 * Honours prefers-reduced-motion by staying on a still frame.
 */
export function useProcessClock(steps: { sec: number }[], offsetSec: number, running = true) {
  const total = steps.reduce((a, s) => a + s.sec, 0)
  const [elapsed, setElapsed] = useState(offsetSec % total)

  useEffect(() => {
    if (!running) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let acc = offsetSec % total
    const id = window.setInterval(() => {
      // Tab in the background: skip instead of drifting.
      if (document.hidden) return
      acc += 1
      setElapsed(acc % total)
    }, 1000)
    return () => window.clearInterval(id)
  }, [offsetSec, total, running])

  let acc = 0
  let stage = 0
  for (let i = 0; i < steps.length; i += 1) {
    if (elapsed < acc + steps[i].sec) {
      stage = i
      break
    }
    acc += steps[i].sec
    stage = i
  }
  const stageElapsed = Math.max(0, elapsed - acc)
  return {
    stage,
    remaining: Math.max(0, steps[stage].sec - stageElapsed),
    elapsed,
    total,
    stageFraction: Math.min(1, stageElapsed / steps[stage].sec),
    totalFraction: Math.min(1, elapsed / total),
  }
}

/** Adds `.in` once the element scrolls into view (one-shot, cheap). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )
    el.querySelectorAll('[data-reveal]').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
  return ref
}

type Meta = {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  ogImage?: string
  canonical: string
}

function setTag(selector: string, attrs: Record<string, string>, create: () => HTMLElement) {
  let el = document.head.querySelector(selector) as HTMLElement | null
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v))
}

/** Per-page <title>, description, OG/Twitter tags and canonical. */
export function useDocumentMeta(meta: Meta) {
  useEffect(() => {
    document.title = meta.title
    setTag('meta[name="description"]', { name: 'description', content: meta.description }, () => {
      const m = document.createElement('meta')
      m.setAttribute('name', 'description')
      return m
    })
    const og = (prop: string, content: string) => {
      setTag(`meta[property="${prop}"]`, { property: prop, content }, () => {
        const m = document.createElement('meta')
        m.setAttribute('property', prop)
        return m
      })
    }
    og('og:type', 'website')
    og('og:title', meta.ogTitle)
    og('og:description', meta.ogDescription)
    og('og:url', meta.canonical)
    og('og:site_name', 'ROTA')
    if (meta.ogImage) og('og:image', meta.ogImage)
    setTag('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' }, () => {
      const m = document.createElement('meta')
      m.setAttribute('name', 'twitter:card')
      return m
    })
    setTag('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.ogTitle }, () => {
      const m = document.createElement('meta')
      m.setAttribute('name', 'twitter:title')
      return m
    })
    setTag('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: meta.ogDescription,
    }, () => {
      const m = document.createElement('meta')
      m.setAttribute('name', 'twitter:description')
      return m
    })
    setTag('link[rel="canonical"]', { rel: 'canonical', href: meta.canonical }, () => {
      const l = document.createElement('link')
      l.setAttribute('rel', 'canonical')
      return l
    })
  }, [meta])
}
