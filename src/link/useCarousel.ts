import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * One carousel behaviour for every three-up block on the page.
 *
 * It pages on its own every `ms`, always leftward (the way you read a spread),
 * and never while the block is off-screen — an autoplay you cannot see has
 * already spent its first two pages by the time you scroll to it.
 *
 * The reader always wins: any manual move restarts the clock, a pointer drag
 * suspends it, and `prefers-reduced-motion` turns autoplay off entirely.
 *
 * Swipe is a *discrete* gesture on purpose — it is the touch equivalent of the
 * arrow button, not a nested scroll area — so the page keeps its vertical
 * scrolling and the browser never has to fight us for the gesture.
 */
const SWIPE_MIN = 42

export type CarouselNav = {
  /** current slide */
  i: number
  /** -1 or +1 for the last manual move; autoplay counts as +1 */
  dir: number
  go: (d: number) => void
  jump: (k: number) => void
  /** live horizontal offset while dragging, in px (0 when idle) */
  dragX: number
  dragging: boolean
  /** spread onto the element that receives swipe gestures */
  hostProps: {
    onPointerDown: (e: React.PointerEvent) => void
    onPointerMove: (e: React.PointerEvent) => void
    onPointerUp: (e: React.PointerEvent) => void
    onPointerCancel: (e: React.PointerEvent) => void
  }
}

export function useCarousel(n: number, ms = 10000) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [visible, setVisible] = useState(false)
  const host = useRef<HTMLDivElement>(null)
  const start = useRef<{ x: number; y: number; axis: 'h' | 'v' | null; id: number } | null>(null)

  const go = useCallback(
    (d: number) => {
      if (!d) return
      setDir(d > 0 ? 1 : -1)
      setI((p) => (p + d + n) % n)
    },
    [n],
  )

  const jump = useCallback(
    (k: number) => {
      setDir(1)
      setI(((k % n) + n) % n)
    },
    [n],
  )

  // autoplay — keyed on `i`, so every move (manual or not) gets a full beat
  useEffect(() => {
    if (ms <= 0 || !visible || dragging) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setTimeout(() => setI((p) => (p + 1) % n), ms)
    return () => window.clearTimeout(t)
  }, [i, visible, dragging, n, ms])

  // only run while the block is actually on screen
  useEffect(() => {
    const el = host.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.15,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    start.current = { x: e.clientX, y: e.clientY, axis: null, id: e.pointerId }
    setDragging(true)
    // keep receiving move/up even if the finger slides off the block
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer already gone — the trailing move/up simply never arrive */
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const s = start.current
    if (!s || s.id !== e.pointerId) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (!s.axis) {
      // wait until the gesture commits to a direction before claiming it
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      s.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'h' : 'v'
    }
    if (s.axis === 'h') setDragX(dx)
  }

  const reset = () => {
    start.current = null
    setDragging(false)
    setDragX(0)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current
    const axis = s?.axis
    const dx = s ? e.clientX - s.x : 0
    reset()
    // a cancelled pointer reports x=0 and must never page on its own
    if (!s || s.id !== e.pointerId || axis !== 'h') return
    if (Math.abs(dx) >= SWIPE_MIN) go(dx < 0 ? 1 : -1)
  }

  return {
    i,
    dir,
    go,
    jump,
    dragX,
    dragging,
    host,
    hostProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: reset,
    },
  }
}
