import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useRef } from "react"
import { HeroSection } from "@/components/sections/HeroSection"
import { SistemaSection } from "@/components/sections/SistemaSection"
import { useReducedMotion } from "@/lib/use-reduced-motion"

// Hero plays its own settle-in animation once on mount and the page scrolls
// normally from there — no pinned/scroll-hijacked stage. Sistema still gets
// a small rounded-corner slide-up-and-settle as it scrolls into view, the
// one piece of the old transition worth keeping — it's a plain "reveal on
// scroll into view" driven by this wrapper's own position, not a pin.
export function HeroTransition() {
  const prefersReducedMotion = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "start 0.6"],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    mass: 0.55,
    restDelta: 0.001,
  })
  const surfaceY = useTransform(progress, [0, 1], [56, 0])
  const surfaceScale = useTransform(progress, [0, 1], [0.965, 1])

  if (prefersReducedMotion) {
    return (
      <>
        <HeroSection />
        <SistemaSection />
      </>
    )
  }

  return (
    <>
      <HeroSection />
      <motion.div
        ref={wrapRef}
        className="relative z-20 -mt-6 origin-top rounded-t-[32px] bg-paper will-change-transform md:-mt-8"
        style={{ y: surfaceY, scale: surfaceScale }}
      >
        <SistemaSection />
      </motion.div>
    </>
  )
}
