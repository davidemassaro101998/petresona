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
  // `clip-path` and `border-radius` both require the browser to repaint on
  // every scroll frame, however cheap the shape — only `transform` and
  // `opacity` are guaranteed to stay on the compositor thread on every
  // device. The reveal is built entirely from those two now: the surface
  // scales in from slightly smaller than full size (anchored to its top
  // edge, so it grows outward the way the old inset-shrink read visually)
  // while sliding up, with a fixed rounded top corner that never animates.
  const surfaceScale = useTransform(progress, [0.22, 0.55, 0.82], [0.92, 0.965, 1])

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
      {/* Tall enough that the video/CTA reveal (the first 35% of progress
          below) takes a deliberate amount of scrolling — mouse wheel or
          touch — instead of finishing inside a single reflexive gesture.
          Every other beat in this file is a progress *fraction*, so this
          one change paces the whole hero-to-sistema journey uniformly
          without needing to re-tune the choreography itself. */}
      <div ref={stageRef} className="relative h-[210svh] md:h-[220svh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <HeroSection
            photoParallaxY={heroY}
            exitImageScale={exitImageScale}
            exitPanelOpacity={exitPanelOpacity}
            exitPanelY={exitPanelY}
            exitOverlayOpacity={exitOverlayOpacity}
            indicatorOpacity={indicatorOpacity}
            heroStageProgress={progress}
          />
        </div>
      </div>

      <motion.div
        className="relative z-20 -mt-[30svh] origin-top rounded-t-[32px] bg-paper will-change-transform md:-mt-[40svh]"
        style={{ y: surfaceY, scale: surfaceScale }}
      >
        <SistemaSection />
      </motion.div>
    </div>
  )
}
