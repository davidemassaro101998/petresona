import { motion, type MotionValue } from "framer-motion"
import { forwardRef } from "react"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"

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
      className="relative flex h-[100svh] min-h-0 max-h-none items-end overflow-hidden bg-brown pb-10 pt-20 md:items-center md:pb-0 md:pt-0"
    >
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={prefersReducedMotion || !exitImageScale ? undefined : { scale: exitImageScale }}
      >
        <picture className="absolute inset-0 block h-full w-full">
          <source media="(max-width: 767px)" srcSet="/assets/images/hero-dog-mobile-v2.webp" />
          <img
            src="/assets/images/hero-dog-desktop-v2.webp"
            alt="Cane appoggiato su un tappeto in un soggiorno luminoso, con la casa e i suoi spazi quotidiani sullo sfondo."
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-brown/95 via-brown/35 to-brown/10 md:bg-gradient-to-r md:from-brown md:via-brown/70 md:to-transparent" />
        {!prefersReducedMotion && exitOverlayOpacity && (
          <motion.div className="absolute inset-0 bg-brown" style={{ opacity: exitOverlayOpacity }} />
        )}
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10"
        style={Object.keys(panelStyle).length ? panelStyle : undefined}
      >
        <div className="max-w-xl">
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="hidden text-xs font-semibold uppercase tracking-[0.26em] text-copper-light md:block"
          >
            ResonaPet · Biorisonanza relazionale · Cani e gatti
          </motion.p>

          <h1 className="font-serif text-[length:var(--text-hero)] leading-[1.05] text-ivory md:mt-4">
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
            className="hidden font-serif text-xl italic text-copper-light md:mt-5 md:block md:text-2xl"
          >
            La relazione ha una frequenza.
          </motion.p>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 1, duration: motionTokens.text }}
            className="mt-3 max-w-lg text-[length:var(--text-body)] leading-relaxed text-ivory/90 md:mt-5"
          >
            <span className="md:hidden">
              Un percorso personale che considera insieme animale, persona e ambiente.
            </span>
            <span className="hidden md:inline">
              Un percorso personale che considera insieme l'animale, la relazione con la sua persona
              e l'ambiente quotidiano. La biorisonanza entra nella fase di elaborazione dedicata,
              svolta tra i tre incontri online.
            </span>
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 1.15, duration: motionTokens.text }}
            className="mt-6 flex flex-wrap items-center gap-6 md:mt-8"
          >
            <InteractiveHoverButton
              href="#come-si-svolge"
              onClick={() => track("hero_cta_click")}
              className="border-copper-light/40 bg-transparent text-ivory"
            >
              Scopri come funziona
            </InteractiveHoverButton>
            <a
              href="/richiedi-accesso.html"
              onClick={() => track("hero_cta_click")}
              className="text-sm font-semibold text-ivory underline decoration-copper-light/60 underline-offset-4 hover:decoration-ivory"
            >
              Richiedi l'accesso →
            </a>
          </motion.div>

          <p className="mt-6 hidden text-[length:var(--text-micro)] text-ivory/80 md:block">
            Tre incontri online · Nessun compito quotidiano · Il pet non deve essere presente in
            video
          </p>
        </div>
      </motion.div>

      <motion.a
        href="#sistema"
        aria-label="Scopri il sistema Animale-Persona-Ambiente"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.4, duration: motionTokens.text }}
        style={prefersReducedMotion || !indicatorOpacity ? undefined : { opacity: indicatorOpacity }}
        className="absolute inset-x-0 bottom-6 z-10 mx-auto hidden w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/85 transition-colors hover:text-ivory md:flex"
      >
        Scopri il sistema
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
          <path d="M5 0v12M1 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.a>
    </section>
  )
})
