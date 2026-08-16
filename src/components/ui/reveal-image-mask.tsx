/**
 * Source: https://21st.dev/@daiwiikharihar/components/reveal-image-mask
 * Retrieved from the authenticated 21st.dev Source > Component.tsx tab
 * (see /tmp source dump supplied for this correction; the earlier `curl`
 * 403 was the unauthenticated HTTP route, not proof the component didn't
 * exist — see 21ST_SOURCES.md for the full history).
 *
 * Adaptations for PetResona:
 * - Removed the demo eyebrow/title/caption block and the outer padded
 *   "card" wrapper — PetResona supplies its own heading/bio next to the
 *   photo, so the component now renders only the masked image.
 * - Removed the `shape: "circle" | "rounded"` switch and the Unsplash
 *   default `src`. The brief calls for one organic (non-circular) mask,
 *   not a perfect circle, so the two clip-path targets are now a single
 *   organic closed blob -> full rounded frame, still driven by the same
 *   useScroll/useSpring/useTransform pipeline as the original.
 * - clipPath easing tuned to a ~950ms perceived open (spring stiffness/
 *   damping below) instead of the original's more elastic circle reveal.
 * - Everything else (useReducedMotion short-circuit, useWillChange,
 *   useScroll offset targeting the element itself, useSpring smoothing)
 *   is unchanged from the original mechanism.
 */
import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useWillChange,
} from "framer-motion"

import { cn } from "@/lib/utils"

export interface RevealImageMaskProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}

// Organic (non-circular) closed blob -> full rounded frame. Both clip-path
// polygons share the same winding order so framer-motion can interpolate
// the vertices smoothly instead of crossfading.
const ORGANIC_CLOSED =
  "polygon(46% 30%, 62% 34%, 70% 48%, 66% 64%, 52% 74%, 36% 68%, 28% 52%, 34% 38%)"
const ORGANIC_OPEN =
  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"

export const RevealImageMask = React.forwardRef<HTMLDivElement, RevealImageMaskProps>(
  function RevealImageMask({ src, alt, className, imgClassName }, ref) {
    const localRef = React.useRef<HTMLDivElement | null>(null)
    const shouldReduceMotion = useReducedMotion()
    const willChange = useWillChange()
    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ["start 85%", "start 35%"],
    })
    const progress = useSpring(scrollYProgress, {
      stiffness: 170,
      damping: 24,
      mass: 0.95,
    })
    const clipPath = useTransform(progress, [0, 1], [ORGANIC_CLOSED, ORGANIC_OPEN])
    const scale = useTransform(progress, [0, 1], [1.06, 1])

    return (
      <div
        ref={(node) => {
          localRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        className={cn("overflow-hidden", className)}
      >
        <motion.img
          src={src}
          alt={alt}
          className={imgClassName}
          style={
            shouldReduceMotion
              ? undefined
              : { clipPath, scale, willChange }
          }
        />
      </div>
    )
  },
)
