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

  // The video/CTA reveal now owns the first half of progress (was 0.35 —
  // see HERO_VIDEO_RANGE in HeroSection). Every exit beat below is pushed
  // back to start once that's actually finished, instead of starting at
  // ~0.25-0.3 and visually racing the still-completing video.
  const exitImageScale = useTransform(progress, [0, 0.5, 0.85, 1], [1, 1, 1.075, 1.1])
  const heroY = useTransform(progress, [0, 0.5, 1], [0, 0, -72])
  const exitPanelOpacity = useTransform(progress, [0, 0.5, 0.8, 0.95], [1, 1, 0.42, 0])
  const exitPanelY = useTransform(progress, [0, 0.5, 0.9], [0, 0, -28])
  const exitOverlayOpacity = useTransform(progress, [0, 0.48, 0.88], [0, 0.04, 0.38])
  const indicatorOpacity = useTransform(progress, [0, 0.32, 0.5], [1, 1, 0])

  const surfaceY = useTransform(progress, [0, 0.4, 0.8], [80, 80, 0])
  // `clip-path` and `border-radius` both require the browser to repaint on
  // every scroll frame, however cheap the shape — only `transform` and
  // `opacity` are guaranteed to stay on the compositor thread on every
  // device. The reveal is built entirely from those two now: the surface
  // scales in from slightly smaller than full size (anchored to its top
  // edge, so it grows outward the way the old inset-shrink read visually)
  // while sliding up, with a fixed rounded top corner that never animates.
  const surfaceScale = useTransform(progress, [0.4, 0.68, 0.88], [0.92, 0.965, 1])

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
      {/* Tall enough that the video/CTA reveal (the first half of progress
          below) takes close to a full screen height of scrolling — mouse
          wheel or touch — matching the pacing approved in preview. */}
      <div ref={stageRef} className="relative h-[270svh] md:h-[280svh]">
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
