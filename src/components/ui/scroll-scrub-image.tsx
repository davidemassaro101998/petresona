import { useEffect, useRef } from "react"
import { useMotionValueEvent, type MotionValue } from "framer-motion"

export interface ScrollScrubImageProps {
  /** Zero-padded frame source resolver, e.g. (i) => `/assets/hero-scroll/h_${pad(i)}.webp` */
  frameSrc: (index: number) => string
  frameCount: number
  /** 0..1 scroll progress driving the sequence. */
  progress: MotionValue<number>
  /** Progress range mapped to frame 0..frameCount-1; progress outside this
   * range clamps to the first/last frame instead of looping or blanking. */
  range?: [number, number]
  className?: string
  /** Fires once all frames are decoded, e.g. to fade the canvas in. */
  onReady?: () => void
}

/**
 * Local (non-fixed) scroll-scrubbed frame sequence, used for short foreground
 * story-scroll moments (hero, percorso) rather than a page-wide background.
 * Same canvas + cover-fit + no-negative-z-index approach as
 * FrequencyBackground, but scoped to a single section and driven by a
 * framer-motion progress value instead of a raw window scroll listener.
 */
export function ScrollScrubImage({
  frameSrc,
  frameCount,
  progress,
  range = [0, 1],
  className,
  onReady,
}: ScrollScrubImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentIndexRef = useRef(-1)
  const drawFrameRef = useRef<(index: number) => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let cancelled = false
    let loadedCount = 0
    const images: HTMLImageElement[] = new Array(frameCount)
    imagesRef.current = images

    function resizeCanvas() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function drawFrame(index: number) {
      const img = images[index]
      const c = canvasRef.current
      if (!img || !img.complete || !img.naturalWidth || !ctx || !c) return
      const rect = c.getBoundingClientRect()
      const cw = rect.width
      const ch = rect.height
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      const dx = (cw - dw) / 2
      const dy = (ch - dh) / 2
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(img, dx, dy, dw, dh)
      currentIndexRef.current = index
    }
    drawFrameRef.current = drawFrame

    resizeCanvas()

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.decoding = "async"
      img.onload = () => {
        loadedCount++
        if (i === 0) drawFrame(0)
        if (loadedCount === frameCount && !cancelled) onReady?.()
      }
      img.src = frameSrc(i)
      images[i] = img
    }

    function onResize() {
      resizeCanvas()
      const idx = currentIndexRef.current
      currentIndexRef.current = -1
      if (idx >= 0) drawFrame(idx)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelled = true
      window.removeEventListener("resize", onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount])

  useMotionValueEvent(progress, "change", (v) => {
    const [start, end] = range
    const t = end === start ? 0 : Math.max(0, Math.min(1, (v - start) / (end - start)))
    const index = Math.round(t * (frameCount - 1))
    if (index !== currentIndexRef.current) drawFrameRef.current(index)
  })

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />
}
