import { useEffect, useRef } from "react"

const FRAME_COUNT = 121
const FRAME_SRC = (i: number) => `/assets/frequency/f_${String(i).padStart(3, "0")}.webp`

/**
 * Fixed, scroll-scrubbed frame-sequence background used behind the plain
 * (photo-less) sections of the page. Frame index tracks scroll position
 * directly (no autoplay, no loop) so it reads as one continuous flow that
 * advances or reverses with the finger/wheel, Apple-product-page style.
 *
 * Deliberately NOT given a negative z-index: an absolutely/fixed positioned
 * element with `-z-10` can silently fail to paint in real browser
 * compositing even though it decodes fine. Instead this sits first in the
 * DOM with z-index 0, and `<main>` gets an explicit `relative z-10` so it
 * reliably stacks above.
 */
export function FrequencyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mql.matches) return

    let cancelled = false
    const images: HTMLImageElement[] = new Array(FRAME_COUNT)
    let loadedCount = 0
    let currentIndex = -1

    function resizeCanvas() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function drawFrame(index: number) {
      const img = images[index]
      if (!img || !img.complete || !img.naturalWidth || !ctx || !canvas) return
      const cw = window.innerWidth
      const ch = window.innerHeight
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      const dx = (cw - dw) / 2
      const dy = (ch - dh) / 2
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
      currentIndex = index
    }

    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const docH = document.documentElement.scrollHeight - window.innerHeight
        const progress = docH > 0 ? Math.max(0, Math.min(1, window.scrollY / docH)) : 0
        const index = Math.round(progress * (FRAME_COUNT - 1))
        if (index !== currentIndex) drawFrame(index)
        ticking = false
      })
    }

    function onResize() {
      resizeCanvas()
      currentIndex = -1
      onScroll()
    }

    resizeCanvas()

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = "async"
      img.onload = () => {
        loadedCount++
        if (i === 0) drawFrame(0)
        if (loadedCount === FRAME_COUNT && !cancelled && canvas) {
          canvas.style.opacity = "1"
        }
      }
      img.src = FRAME_SRC(i)
      images[i] = img
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    onScroll()

    return () => {
      cancelled = true
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-700 ease-out"
    />
  )
}
