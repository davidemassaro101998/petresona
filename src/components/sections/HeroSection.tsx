import { motion, type MotionValue } from "framer-motion"
import { forwardRef } from "react"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"
import { WHATSAPP_LINK_GENERAL } from "@/config/contact"

export interface HeroSectionProps {
  /** Cinematic zoom owned entirely by HeroTransition. */
  exitImageScale?: MotionValue<number>
  /** Text/panel opacity during the hero's exit (not the photo). */
  exitPanelOpacity?: MotionValue<number>
  /** Small upward drift of the text panel during the hero's exit. */
  exitPanelY?: MotionValue<number>
  /** 0 -> ~0.38, layered above the existing gradient during exit. */
  exitOverlayOpacity?: MotionValue<number>
  /** Fades out the "Continua" indicator as the hero starts to exit. */
  indicatorOpacity?: MotionValue<number>
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(function HeroSection(
  { exitImageScale, exitPanelOpacity, exitPanelY, exitOverlayOpacity, indicatorOpacity },
  ref,
) {
  const prefersReducedMotion = useReducedMotion()

  const panelStyle: Record<string, MotionValue<number>> = {}
  if (!prefersReducedMotion) {
    if (exitPanelOpacity) panelStyle.opacity = exitPanelOpacity
    if (exitPanelY) panelStyle.y = exitPanelY
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex h-[100svh] min-h-0 max-h-none items-end overflow-hidden bg-brown pb-16 pt-28 md:pb-20"
    >
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={prefersReducedMotion || !exitImageScale ? undefined : { scale: exitImageScale }}
      >
        <picture className="absolute inset-0 block h-full w-full">
          <source media="(max-width: 767px)" srcSet="/assets/images/hero-dogcat-mobile-v1.webp" />
          <img
            src="/assets/images/hero-dogcat-desktop-v1.webp"
            alt="Un cane e un gatto condividono lo stesso soggiorno luminoso, ognuno nel proprio spazio."
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-brown/85 via-brown/20 to-transparent" />
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background: "radial-gradient(50% 60% at 80% 90%, rgba(59,42,34,0.6) 0%, rgba(59,42,34,0.15) 55%, transparent 80%)",
          }}
        />
        {!prefersReducedMotion && exitOverlayOpacity && (
          <motion.div className="absolute inset-0 bg-brown" style={{ opacity: exitOverlayOpacity }} />
        )}
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-6xl px-5 md:px-10 md:justify-end"
        style={Object.keys(panelStyle).length ? panelStyle : undefined}
      >
        <div className="max-w-xl md:max-w-lg">
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="hero-eyebrow hidden text-xs font-semibold uppercase tracking-[0.26em] text-copper-light drop-shadow-[0_1px_6px_rgba(35,20,15,0.5)] md:block"
          >
            ResonaPet · Biorisonanza relazionale · Cani e gatti
          </motion.p>

          <h1 className="font-serif text-[2.1rem] leading-[1.1] text-ivory drop-shadow-[0_2px_14px_rgba(35,20,15,0.45)] md:mt-3 md:text-[2.65rem]">
            {prefersReducedMotion ? (
              <>
                Il tuo animale non vive isolato.
                <br />
                Vive dentro una relazione
                <br />e un ambiente.
              </>
            ) : (
              <VerticalCutReveal
                splitBy="lines"
                staggerDuration={0.075}
                staggerFrom="first"
                transition={{ type: "spring", stiffness: 160, damping: 24 }}
                autoStart
              >
                {"Il tuo animale non vive isolato.\nVive dentro una relazione\ne un ambiente."}
              </VerticalCutReveal>
            )}
          </h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.85, duration: motionTokens.text }}
            className="mt-2 font-serif text-base italic text-copper-light drop-shadow-[0_2px_10px_rgba(35,20,15,0.45)] md:mt-3 md:text-xl"
          >
            La relazione ha una frequenza.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 1.15, duration: motionTokens.text }}
            className="mt-5 flex flex-wrap items-center gap-4 md:mt-6"
          >
            <InteractiveHoverButton
              href="#come-si-svolge"
              onClick={() => track("hero_cta_click")}
              className="border-copper-light/40 bg-transparent text-ivory"
            >
              Scopri come funziona
            </InteractiveHoverButton>
            <a
              href={WHATSAPP_LINK_GENERAL}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("hero_cta_click")}
              className="inline-flex items-center justify-center rounded-full bg-copper px-6 py-3 text-sm font-semibold text-ivory shadow-[0_10px_30px_-12px_rgba(35,20,15,0.6)] transition-colors hover:bg-copper-text"
            >
              Richiedi l'accesso →
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#sistema"
        aria-label="Scopri il sistema Animale-Persona-Ambiente"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.4, duration: motionTokens.text }}
        style={prefersReducedMotion || !indicatorOpacity ? undefined : { opacity: indicatorOpacity }}
        className="hero-scroll-indicator absolute inset-x-0 bottom-6 z-10 mx-auto hidden w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/85 transition-colors hover:text-ivory md:flex"
      >
        Scopri il sistema
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
          <path d="M5 0v12M1 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.a>
    </section>
  )
})
