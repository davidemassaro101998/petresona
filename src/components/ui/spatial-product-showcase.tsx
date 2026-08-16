/**
 * Source: https://21st.dev/@daiwiikharihar/components/spatial-product-showcase
 * Retrieved from the authenticated 21st.dev Source > Component.tsx tab
 * (the earlier `curl` 403 was the unauthenticated HTTP route — see
 * 21ST_SOURCES.md for the full history of this component).
 *
 * The original ("EarbudShowcase") is a two-earbud spatial-audio demo.
 * Kept from the real source, per the brief's instruction to adapt rather
 * than rewrite:
 * - `AnimatePresence` around the swapping content, keyed by the active
 *   item so it exits/enters instead of crossfading in place.
 * - The `container`/`item` stagger variants for the text column
 *   (opacity/y/blur spring-in, staggerChildren/delayChildren).
 * - `layoutId` on the active-indicator pill inside the trigger dock, so
 *   the highlight morphs between triggers instead of jump-cutting.
 * - `whileTap={{ scale: 0.96 }}` on the trigger buttons.
 * - A user-driven `activeId`/`onToggle` selector (renamed to
 *   `activeIndex`/`onSelect` for three items instead of two).
 * - Directional content change between the two data states.
 *
 * Removed (demo/tech-audio specific, explicitly out of scope per the
 * brief): the earbud renders and their `image` variant's ±30° rotation /
 * scale-1.5 / 15px-blur entrance; Battery/Bluetooth/Wifi/Music icons and
 * the battery-percentage and feature-bar readouts; "View Specs"; the
 * black/blue/emerald tech gradient background and glow; the infinite
 * `rotate: 360` ring and the infinite `scale`/`y` breathing loops; the
 * `fixed` bottom-12 switcher and `fixed inset-0` background layer;
 * `min-h-screen` on the root (the section sizes itself to its content).
 *
 * Adapted: two earbuds -> three PetResona items (Traccia d'Ambiente,
 * Codice Impronta, Guida Impronta) reusing the V3 copy and CSS/SVG
 * mockups as the `visual`. The desktop stage keeps the real
 * container/item/AnimatePresence mechanism; the trigger dock is inline
 * under the stage (not fixed) using PetResona's ivory/copper/brown/forest
 * palette. A compact single-open mobile layout was added — the original
 * component has no mobile treatment of its own — per the brief's explicit
 * "adapt responsive behavior" instruction (section 3.4).
 */
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { useState } from "react"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"

export interface ShowcaseItem {
  index: string
  label: string
  description: string
  visual: React.ReactNode
}

const ANIMATIONS: { container: Variants; item: Variants } = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  item: {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 140, damping: 22 },
    },
    exit: { opacity: 0, y: -8, filter: "blur(4px)" },
  },
}

export function SpatialProductShowcase({ items }: { items: ShowcaseItem[] }) {
  const [active, setActive] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const current = items[active]

  const select = (i: number) => setActive(i)

  return (
    <div>
      {/* Desktop: one editorial stage, text and visual swap in place */}
      <div className="hidden md:block">
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.index}
                variants={prefersReducedMotion ? undefined : ANIMATIONS.container}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.p
                  variants={prefersReducedMotion ? undefined : ANIMATIONS.item}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-copper"
                >
                  {current.index}
                </motion.p>
                <motion.h3
                  variants={prefersReducedMotion ? undefined : ANIMATIONS.item}
                  className="mt-3 font-serif text-2xl text-brown"
                >
                  {current.label}
                </motion.h3>
                <motion.p
                  variants={prefersReducedMotion ? undefined : ANIMATIONS.item}
                  className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-brown/70"
                >
                  {current.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative min-h-[280px] overflow-hidden rounded-[22px] border border-line bg-ivory">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.index}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: motionTokens.image, ease: motionTokens.easeOut as unknown as [number, number, number, number] }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                {current.visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Trigger dock — inline under the stage, not fixed */}
        <div className="mt-8 flex items-center gap-1 rounded-full border border-line bg-ivory p-1.5 w-fit">
          {items.map((item, i) => (
            <motion.button
              key={item.index}
              type="button"
              onClick={() => select(i)}
              whileTap={{ scale: 0.96 }}
              aria-current={i === active}
              className={`group relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-copper ${
                i === active ? "" : "hover:bg-copper/10"
              }`}
            >
              {i === active && (
                <motion.span
                  layoutId="showcase-active-pill"
                  className="absolute inset-0 rounded-full bg-copper"
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                />
              )}
              <span className={`relative z-10 transition-colors ${i === active ? "text-ivory" : "text-brown/70 group-hover:text-copper"}`}>
                {item.index} — {item.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mobile: compact single-open triggers, no stage, no duplication —
          the real source has no mobile treatment of its own; this is the
          brief's required responsive adaptation. */}
      <div className="grid gap-0 md:hidden">
        {items.map((item, i) => {
          const open = i === active
          return (
            <div key={item.index} className="border-t border-line last:border-b">
              <button
                type="button"
                onClick={() => select(i)}
                aria-expanded={open}
                aria-controls={`showcase-panel-${item.index}`}
                className="flex min-h-[44px] w-full items-center justify-between gap-3 py-4 text-left"
              >
                <span className="font-serif text-base text-brown">
                  <span className="mr-2 text-copper">{item.index}</span>
                  {item.label}
                </span>
                <span className={`text-copper transition-transform ${open ? "rotate-45" : ""}`} aria-hidden="true">
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`showcase-panel-${item.index}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: motionTokens.accordion, ease: motionTokens.easeOut as unknown as [number, number, number, number] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-5">
                      <p className="text-sm leading-relaxed text-brown/70">{item.description}</p>
                      <div className="mt-4 flex justify-center">{item.visual}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
