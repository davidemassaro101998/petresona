import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion"
import { forwardRef, useState } from "react"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { ScrollScrubImage } from "@/components/ui/scroll-scrub-image"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { useIsMobile } from "@/lib/use-is-mobile"
import { track } from "@/lib/analytics"
import { WHATSAPP_LINK_GENERAL } from "@/config/contact"

const HERO_VIDEO_FRAME_COUNT = 49
const heroVideoFrameSrc = (i: number) => `/assets/hero-scroll/h_${String(i).padStart(3, "0")}.webp`
const HERO_VIDEO_FRAME_COUNT_DESKTOP = 49
const heroVideoFrameSrcDesktop = (i: number) => `/assets/hero-scroll-desktop/hd_${String(i).padStart(3, "0")}.webp`
/** Portion of the pinned hero stage's scroll progress spent on the
 * story-scroll moment (dog & cat lifting their heads, CTA revealing)
 * before the rest of the existing exit choreography takes over. */
const HERO_VIDEO_RANGE: [number, number] = [0, 0.5]

export interface HeroSectionProps {
  /** Upward parallax drift owned by HeroTransition — applied to the photo
   * layer only, never to the text (which sits close to the fixed header
   * now that it lives at the top of the section; drifting it too would
   * carry it up underneath the header on exit). */
  photoParallaxY?: MotionValue<number>
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
  /** 0..1 progress across the whole pinned hero stage — used to drive the
   * dog/cat story-scroll frames and sync the CTA reveal to it. */
  heroStageProgress?: MotionValue<number>
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(function HeroSection(
  { photoParallaxY, exitImageScale, exitPanelOpacity, exitPanelY, exitOverlayOpacity, indicatorOpacity, heroStageProgress },
  ref,
) {
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const [videoReady, setVideoReady] = useState(false)
  const [videoReadyDesktop, setVideoReadyDesktop] = useState(false)

  const panelStyle: Record<string, MotionValue<number>> = {}
  if (!prefersReducedMotion) {
    if (exitPanelOpacity) panelStyle.opacity = exitPanelOpacity
    if (exitPanelY) panelStyle.y = exitPanelY
  }

  const photoStyle: Record<string, MotionValue<number>> = {}
  if (!prefersReducedMotion) {
    if (exitImageScale) photoStyle.scale = exitImageScale
    if (photoParallaxY) photoStyle.y = photoParallaxY
  }

  const fallbackProgress = useMotionValue(0)
  const ctaOpacity = useTransform(heroStageProgress ?? fallbackProgress, HERO_VIDEO_RANGE, [0, 1])
  // On mobile the CTA is always visible (no scroll gate) — every visitor
  // this week can request access the instant the hero loads, no gesture
  // required. Desktop keeps the scroll-synced reveal.
  const useScrollLinkedCta = !prefersReducedMotion && !isMobile && !!heroStageProgress
  const skipCtaAnimation = prefersReducedMotion || isMobile
  // Momento 1 -> Momento 3: the headline crossfades over the same range as
  // the video/CTA reveal, so the copy lands exactly as the dog and cat
  // settle and the CTA finishes appearing.
  const momento1Opacity = useTransform(heroStageProgress ?? fallbackProgress, HERO_VIDEO_RANGE, [1, 0])
  const momento3Opacity = useTransform(heroStageProgress ?? fallbackProgress, HERO_VIDEO_RANGE, [0, 1])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex h-[100svh] min-h-0 max-h-none flex-col justify-between overflow-hidden bg-brown pb-16 pt-32 md:pb-20 md:pt-32"
    >
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={Object.keys(photoStyle).length ? photoStyle : undefined}
      >
        <picture className="absolute inset-0 block h-full w-full md:hidden">
          {/* Poster is the video's own first frame, so there is no pop
              when the scroll-scrubbed canvas takes over on top of it.
              Slightly blurred on mobile only, so the (now always-visible)
              text and CTA read as the clear focal point. */}
          <img
            src={heroVideoFrameSrc(0)}
            alt="Un cane e un gatto distesi vicini in un soggiorno luminoso."
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center blur-[1.5px]"
          />
        </picture>
        <picture className="absolute inset-0 hidden h-full w-full md:block">
          <img
            src={heroVideoFrameSrcDesktop(0)}
            alt="Un cane e un gatto distesi vicini in un soggiorno luminoso."
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </picture>
        {!prefersReducedMotion && (
          <ScrollScrubImage
            frameSrc={heroVideoFrameSrc}
            frameCount={HERO_VIDEO_FRAME_COUNT}
            progress={heroStageProgress ?? fallbackProgress}
            range={HERO_VIDEO_RANGE}
            onReady={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full scale-105 object-cover object-center blur-[1.5px] transition-opacity duration-500 ease-out md:hidden ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {!prefersReducedMotion && (
          <ScrollScrubImage
            frameSrc={heroVideoFrameSrcDesktop}
            frameCount={HERO_VIDEO_FRAME_COUNT_DESKTOP}
            progress={heroStageProgress ?? fallbackProgress}
            range={HERO_VIDEO_RANGE}
            onReady={() => setVideoReadyDesktop(true)}
            className={`absolute inset-0 hidden h-full w-full object-cover object-center transition-opacity duration-500 ease-out md:block ${
              videoReadyDesktop ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {/* Text now sits at the top and the CTA at the bottom (both
            breakpoints), so the photo needs darkening at both ends —
            the middle, where the two pets read clearly, stays bright. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(59,42,34,0.8) 0%, rgba(59,42,34,0.12) 26%, transparent 42%, transparent 62%, rgba(59,42,34,0.15) 78%, rgba(59,42,34,0.75) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(70% 42% at 38% 14%, rgba(35,20,15,0.5) 0%, rgba(35,20,15,0.16) 55%, transparent 80%)",
          }}
        />
        {!prefersReducedMotion && exitOverlayOpacity && (
          <motion.div className="absolute inset-0 bg-brown" style={{ opacity: exitOverlayOpacity }} />
        )}
      </motion.div>

      {/* Top: eyebrow, headline, tagline. */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10"
        style={Object.keys(panelStyle).length ? panelStyle : undefined}
      >
        <div className="max-w-xl md:max-w-lg">
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.26em] text-copper-light drop-shadow-[0_1px_6px_rgba(35,20,15,0.5)]"
          >
            ResonaPet · Biorisonanza relazionale
          </motion.p>

          <div className="relative mt-2 md:mt-3">
            <motion.h1
              style={prefersReducedMotion ? undefined : { opacity: momento1Opacity }}
              className="font-serif text-[2.1rem] leading-[1.15] text-ivory drop-shadow-[0_2px_14px_rgba(35,20,15,0.45)] md:text-[2.65rem]"
            >
              {prefersReducedMotion ? (
                <>
                  Il tuo animale vive nella tua casa,
                  <br />
                  dentro le vostre dinamiche.
                  <br />
                  ResonaPet lo riequilibra a distanza.
                </>
              ) : (
                <VerticalCutReveal
                  splitBy="lines"
                  staggerDuration={0.075}
                  staggerFrom="first"
                  transition={{ type: "spring", stiffness: 160, damping: 24 }}
                  autoStart
                >
                  {"Il tuo animale vive nella tua casa,\ndentro le vostre dinamiche.\nResonaPet lo riequilibra a distanza."}
                </VerticalCutReveal>
              )}
            </motion.h1>
            {/* Momento 3 — crossfades in over the same block as the dog and
                cat finish settling; skipped entirely under reduced motion,
                which shows only the Momento 1 copy above (paired with the
                static resting-pets poster it also shows in that mode). */}
            {!prefersReducedMotion && (
              <motion.h1
                style={{ opacity: momento3Opacity }}
                className="absolute inset-0 font-serif text-[2.1rem] leading-[1.15] text-ivory drop-shadow-[0_2px_14px_rgba(35,20,15,0.45)] md:text-[2.65rem]"
              >
                Si riequilibra insieme — lui, tu, la casa che condividete.
              </motion.h1>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom: urgency badge (always visible, not gated behind scroll)
          + CTA (revealed by the first scroll gesture, in sync with the
          dog & cat lifting their heads in the video above). */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10">
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brown-deep/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-copper-light backdrop-blur-sm">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-copper-light" />
          Posti limitati questa settimana
        </p>
        <motion.div
          initial={useScrollLinkedCta || skipCtaAnimation ? false : { opacity: 0, y: 10 }}
          animate={useScrollLinkedCta ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: skipCtaAnimation ? 0 : 1.15, duration: motionTokens.text }}
          style={useScrollLinkedCta ? { opacity: ctaOpacity } : undefined}
          className="flex max-w-xl flex-wrap items-center gap-4 md:max-w-lg">
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
