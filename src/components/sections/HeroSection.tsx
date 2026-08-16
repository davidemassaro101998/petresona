import { motion, type MotionValue } from "framer-motion"
import { forwardRef } from "react"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"

export interface HeroSectionProps {
  /** Cinematic zoom owned entirely by HeroImprintTransition. */
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
      className="relative flex h-[100svh] min-h-0 max-h-none items-center overflow-hidden bg-brown"
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
            className="text-xs font-semibold uppercase tracking-[0.26em] text-copper-light"
          >
            PetResona Impronta · Cani e gatti
          </motion.p>

          <h1 className="mt-4 font-serif text-[2.1rem] leading-[1.1] text-ivory sm:text-5xl md:text-[3.2rem]">
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
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.95, duration: motionTokens.text }}
            className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-ivory/85"
          >
            Un percorso personale di 14 giorni in cui informazioni, fotografie e quotidianità
            diventano la base per preparare un'Impronta dedicata al tuo pet e al suo ambiente.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReducedMotion ? 0 : 1.15, duration: motionTokens.text }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <InteractiveHoverButton
              href="#cosa-ricevi"
              onClick={() => track("hero_cta_click")}
              className="border-copper-light/40 bg-transparent text-ivory"
            >
              Scopri l'Impronta
            </InteractiveHoverButton>
            <a
              href="/richiedi-accesso.html"
              onClick={() => track("hero_cta_click")}
              className="text-sm font-semibold text-ivory underline decoration-copper-light/60 underline-offset-4 hover:decoration-ivory"
            >
              Richiedi accesso →
            </a>
          </motion.div>

          <p className="mt-6 text-xs text-ivory/60">
            Tre incontri online · Nessun diario · Il pet non deve essere in video
          </p>
        </div>
      </motion.div>

      <motion.a
        href="#impronta"
        aria-label="Continua verso la sezione Impronta"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.4, duration: motionTokens.text }}
        style={prefersReducedMotion || !indicatorOpacity ? undefined : { opacity: indicatorOpacity }}
        className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:text-ivory"
      >
        Continua
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
          <path d="M5 0v12M1 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.a>
    </section>
  )
})
