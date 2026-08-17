// Motion architecture adapted for ResonaPet after review of:
// https://21st.dev/@componentry/components/scroll-choreography
// Original implementation: ResonaPet hero-to-system transition.
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"
import { HeroSection } from "@/components/sections/HeroSection"
import { SistemaSection } from "@/components/sections/SistemaSection"
import { useReducedMotion } from "@/lib/use-reduced-motion"

export function HeroTransition() {
  const prefersReducedMotion = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    mass: 0.55,
    restDelta: 0.001,
  })

  const exitImageScale = useTransform(progress, [0, 0.28, 0.72, 1], [1, 1, 1.075, 1.1])
  const heroY = useTransform(progress, [0, 0.34, 1], [0, 0, -72])
  const exitPanelOpacity = useTransform(progress, [0, 0.32, 0.72, 0.9], [1, 1, 0.42, 0])
  const exitPanelY = useTransform(progress, [0, 0.34, 0.82], [0, 0, -28])
  const exitOverlayOpacity = useTransform(progress, [0, 0.3, 0.82], [0, 0.04, 0.38])
  const indicatorOpacity = useTransform(progress, [0, 0.2, 0.38], [1, 1, 0])

  const surfaceY = useTransform(progress, [0, 0.25, 0.68], [80, 80, 0])
  // Split what used to be a single `clip-path: inset(... round ...)` into two
  // cheaper properties animated separately: a plain rectangular inset (no
  // embedded corner arcs, much less to rasterize per scroll frame) plus a
  // real `border-radius`, which browsers composite far more efficiently than
  // a clip-path corner curve. Same visual result, far less scroll jank.
  const surfaceClip = useTransform(
    progress,
    [0.22, 0.55, 0.82],
    ["inset(10% 3% 0% 3%)", "inset(2% 1% 0% 1%)", "inset(0% 0% 0% 0%)"],
  )
  const surfaceRadius = useTransform(progress, [0.22, 0.55, 0.82], [64, 46, 32])

  if (prefersReducedMotion) {
    return (
      <>
        <HeroSection />
        <SistemaSection />
      </>
    )
  }

  return (
    <div className="relative">
      <div ref={stageRef} className="relative h-[130svh] md:h-[140svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div className="relative h-full" style={{ y: heroY }}>
            <HeroSection
              exitImageScale={exitImageScale}
              exitPanelOpacity={exitPanelOpacity}
              exitPanelY={exitPanelY}
              exitOverlayOpacity={exitOverlayOpacity}
              indicatorOpacity={indicatorOpacity}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="relative z-20 -mt-[30svh] bg-paper md:-mt-[40svh]"
        style={{
          y: surfaceY,
          clipPath: surfaceClip,
          borderTopLeftRadius: surfaceRadius,
          borderTopRightRadius: surfaceRadius,
          willChange: "clip-path, transform",
        }}
      >
        <SistemaSection />
      </motion.div>
    </div>
  )
}
