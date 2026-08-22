import { motion, useMotionValue, useInView, animate } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { ScrollScrubImage } from "@/components/ui/scroll-scrub-image"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"
import { WHATSAPP_LINK_GENERAL } from "@/config/contact"

const HERO_VIDEO_FRAME_COUNT = 49
const heroVideoFrameSrc = (i: number) => `/assets/hero-scroll/h_${String(i).padStart(3, "0")}.webp`
const HERO_VIDEO_FRAME_COUNT_DESKTOP = 49
const heroVideoFrameSrcDesktop = (i: number) => `/assets/hero-scroll-desktop/hd_${String(i).padStart(3, "0")}.webp`

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion()
  const [videoReady, setVideoReady] = useState(false)
  const [videoReadyDesktop, setVideoReadyDesktop] = useState(false)

  // Plays once, in slow motion, each time the hero scrolls into view — and
  // silently rewinds to frame 0 (no animation, it's off-screen) as soon as
  // it scrolls back out, so it's ready to replay from the start next time.
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { amount: 0.6 })
  const progress = useMotionValue(0)
  useEffect(() => {
    if (prefersReducedMotion) return
    if (inView) {
      const controls = animate(progress, 1, { duration: 3.4, ease: "easeOut", delay: 0.3 })
      return () => controls.stop()
    }
    progress.set(0)
  }, [inView, prefersReducedMotion, progress])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-[100svh] min-h-0 max-h-none flex-col justify-between overflow-hidden bg-brown pb-16 pt-32 md:pb-20 md:pt-32"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <picture className="absolute inset-0 block h-full w-full md:hidden">
          {/* Poster is the video's own first frame, so there is no pop
              when the auto-playing canvas takes over on top of it. */}
          <img
            src={heroVideoFrameSrc(0)}
            alt="Un cane e un gatto distesi vicini in un soggiorno luminoso."
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
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
            progress={progress}
            onReady={() => setVideoReady(true)}
            className={`absolute inset-0 h-full w-full scale-105 object-cover object-center transition-opacity duration-500 ease-out md:hidden ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {!prefersReducedMotion && (
          <ScrollScrubImage
            frameSrc={heroVideoFrameSrcDesktop}
            frameCount={HERO_VIDEO_FRAME_COUNT_DESKTOP}
            progress={progress}
            onReady={() => setVideoReadyDesktop(true)}
            className={`absolute inset-0 hidden h-full w-full object-cover object-center transition-opacity duration-500 ease-out md:block ${
              videoReadyDesktop ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
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
      </div>

      {/* Top: eyebrow, headline, tagline. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10">
        <div className="max-w-xl md:max-w-lg">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-brown-deep/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-copper-light backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-copper-light opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-copper-light" />
            </span>
            Posti limitati questa settimana
          </p>
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="hero-eyebrow text-xs font-semibold uppercase tracking-[0.26em] text-copper-light drop-shadow-[0_1px_6px_rgba(35,20,15,0.5)]"
          >
            ResonaPet · Biorisonanza relazionale
          </motion.p>

          <h1 className="mt-2 font-serif text-[2.1rem] leading-[1.15] text-ivory drop-shadow-[0_2px_14px_rgba(35,20,15,0.45)] md:mt-3 md:text-[2.65rem]">
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
          </h1>
        </div>
      </div>

      {/* Bottom: CTA, visible immediately on every device — no scroll
          gesture required to request access. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-10">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReducedMotion ? 0 : 1.15, duration: motionTokens.text }}
          className="flex max-w-xl flex-wrap items-center gap-4 md:max-w-lg"
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

      <motion.a
        href="#sistema"
        aria-label="Scopri il sistema Animale-Persona-Ambiente"
        initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.4, duration: motionTokens.text }}
        className="hero-scroll-indicator absolute inset-x-0 bottom-6 z-10 mx-auto hidden w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ivory/85 transition-colors hover:text-ivory md:flex"
      >
        Scopri il sistema
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" aria-hidden="true">
          <path d="M5 0v12M1 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.a>
    </section>
  )
}
