/**
 * Source: https://21st.dev/@unlumen/components/scroll-reveal-image
 * Retrieved from the authenticated 21st.dev Source > Component.tsx tab
 * (the earlier `curl` 403 was the unauthenticated HTTP route — see
 * 21ST_SOURCES.md for the full history of this component).
 *
 * Adaptations for ResonaPet (Vite, not Next.js):
 * - `next/image` replaced with a plain `<img>`. The original used the
 *   `fill` prop (absolute, inset-0, 100%/100%, object-cover) — replicated
 *   here with inline styles since there is no Vite equivalent. `priority`
 *   maps to `fetchPriority="high"` + `loading="eager"` (closest native
 *   equivalents); `quality` has no native counterpart and is dropped.
 * - Added a named export alongside the original's default export so the
 *   rest of the ResonaPet codebase (which imports `{ ScrollRevealImage }`)
 *   didn't need to change its import style. No behavior was touched.
 * - Everything else — useScroll/useTransform/useSpring, the two nested
 *   motion.div containers, the width/scale/radius transforms — is
 *   unchanged from the original.
 * - V5: added an optional `mobileSrc`, rendering a <picture> with a
 *   `(max-width: 767px)` <source> for the art-directed mobile crop. Motion
 *   logic untouched.
 *
 * ResonaPet config passed at the call site (HeroSection): fromWidth="68%"
 * toWidth="100%" fromScale={1.12} toScale={1} fromRadius="48px"
 * toRadius="12px" stiffness={115} damping={38} height="100%" — no demo
 * `50vh` spacers are used anywhere, so this adds no page height and the
 * reveal is already progressing within the first viewport since the hero
 * image sits at the top of the page.
 */
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"

export interface ScrollRevealImageProps {
  // Image
  src: string
  alt: string
  priority?: boolean
  mobileSrc?: string

  // Container
  height?: string
  fromWidth?: string
  toWidth?: string
  fromRadius?: string
  toRadius?: string
  /** Scroll progress (0–1) at which border radius starts animating */
  radiusStart?: number

  // Inner image — wider than container to allow the zoom effect
  innerWidth?: string
  fromScale?: number
  toScale?: number

  // Spring physics
  stiffness?: number
  damping?: number

  // Scroll offset (framer-motion OffsetPoint tuple)
  scrollOffset?: NonNullable<Parameters<typeof useScroll>[0]>["offset"]

  /** Optional scrollable ancestor ref (defaults to viewport) */
  container?: React.RefObject<HTMLElement | null>

  // Layout
  className?: string
  imageClassName?: string
}

export default function ScrollRevealImage({
  src,
  alt,
  priority = false,
  mobileSrc,
  height = "80vh",
  fromWidth = "40vw",
  toWidth = "95vw",
  fromRadius = "0px",
  toRadius = "22px",
  radiusStart = 0.5,
  innerWidth = "95vw",
  fromScale = 1.6,
  toScale = 1,
  stiffness = 120,
  damping = 80,
  scrollOffset = ["start end", "start start"] as const,
  container,
  className,
  imageClassName,
}: ScrollRevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    container,
    offset: scrollOffset,
  })

  const width = useTransform(scrollYProgress, [0, 1], [fromWidth, toWidth])
  const scale = useTransform(scrollYProgress, [0, 1], [fromScale, toScale])
  const radius = useTransform(
    scrollYProgress,
    [radiusStart, 1],
    [fromRadius, toRadius],
  )

  const smoothWidth = useSpring(width, { stiffness, damping })
  const smoothScale = useSpring(scale, { stiffness, damping })
  const smoothRadius = useSpring(radius, { stiffness, damping })

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{
        width: smoothWidth,
        position: "relative",
        height,
        borderRadius: smoothRadius,
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          x: "-50%",
          width: innerWidth,
          height: "100%",
          scale: smoothScale,
          originX: 0.5,
          originY: 0.5,
        }}
      >
        <picture className="absolute inset-0 block h-full w-full">
          {mobileSrc && <source media="(max-width: 767px)" srcSet={mobileSrc} />}
          <img
            src={src}
            alt={alt}
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover${imageClassName ? ` ${imageClassName}` : ""}`}
          />
        </picture>
      </motion.div>
    </motion.div>
  )
}

export { ScrollRevealImage }
