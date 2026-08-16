/**
 * PetResona-adapted variant of Skiper19 (see svg-follow-scroll.tsx for the
 * unmodified original + full attribution).
 *
 * Kept from the original: `useScroll`, `useTransform`, the `pathLength`
 * animation driven by scroll progress, `motion.path`, and the scroll-synced
 * tracing mechanic itself.
 *
 * V4 fix (hero -> Impronta transition brief): the previous version confined
 * the trace to a narrow 70-90px strip on the right edge of #impronta, which
 * read as a stray vertical divider next to the cat photo rather than an
 * "Impronta". It has been removed from `ImprontaSection` entirely and
 * rebuilt as a wide diagonal presence (~38-45vw desktop, ~55-65vw mobile)
 * that starts in the hero's lower-right and dissolves within the first
 * 20-25% of Impronta, positioned by `HeroImprintTransition` so it never
 * overlaps the dog, the cat, or any text/CTA.
 */
"use client";

import { motion, useReducedMotion, type MotionValue } from "framer-motion";

/**
 * Wide diagonal organic trace — not a cartoon paw, not an ECG line, not a
 * divider. Drawn via `pathLength`/`strokeDashoffset` from two MotionValues
 * the caller derives from scroll progress (draw progress + a separate fade
 * progress so the line can finish drawing before it dissolves).
 */
export function ImprintPath({
  drawProgress,
  fadeOpacity,
  className,
}: {
  drawProgress: MotionValue<number>;
  fadeOpacity: MotionValue<number>;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 620 480"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ ["--imprint-stroke" as string]: "3px" }}
    >
      <motion.path
        d="M600 20
           C 520 10, 470 55, 480 110
           C 490 168, 560 172, 566 122
           C 571 78, 512 62, 494 100
           C 474 142, 520 190, 470 214
           C 400 248, 330 210, 270 244
           C 200 284, 220 340, 160 366
           C 96 393, 40 360, 26 300"
        stroke="var(--color-copper)"
        strokeWidth="var(--imprint-stroke, 4px)"
        strokeLinecap="round"
        style={
          prefersReducedMotion
            ? { pathLength: 0, opacity: 0 }
            : { pathLength: drawProgress, opacity: fadeOpacity }
        }
      />
    </svg>
  );
}
