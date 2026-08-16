import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const STEPS = [
  {
    title: "Ritratto iniziale",
    body: "Compili il questionario, invii le fotografie richieste e incontri Giorgia online per raccontare il tuo pet e il suo contesto.",
  },
  {
    title: "Preparazione Impronta",
    body: "Giorgia esamina i materiali e svolge con CIEM System il lavoro di biorisonanza dedicato alla triade. Da questa fase prepara Traccia d'Ambiente, Codice Impronta e Guida Impronta.",
  },
  {
    title: "Consegna guidata",
    body: "Nel secondo incontro ricevi Traccia d'Ambiente, Codice Impronta e Guida Impronta, con indicazioni semplici per utilizzarli.",
  },
  {
    title: "Incontro di sintesi",
    body: "Il terzo incontro raccoglie verbalmente le tue osservazioni e conclude l'esperienza con le indicazioni finali.",
  },
]

function Step({ index, title, body }: { index: number; title: string; body: string }) {
  const ref = useRef<HTMLLIElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 45%"] })
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1])
  const x = useTransform(scrollYProgress, [0, 1], [14, 0])
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const numBg = useTransform(fill, (v) => (v > 0.5 ? "var(--color-copper)" : "var(--color-paper)"))
  const numColor = useTransform(fill, (v) => (v > 0.5 ? "var(--color-ivory)" : "var(--color-copper)"))

  return (
    <li ref={ref} className="relative flex gap-7 pb-9 last:pb-0 md:gap-8">
      <motion.span
        aria-hidden="true"
        className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-copper bg-paper font-serif text-[1.05rem] md:h-12 md:w-12"
        style={
          prefersReducedMotion
            ? { backgroundColor: "var(--color-copper)", color: "var(--color-ivory)" }
            : { backgroundColor: numBg, color: numColor }
        }
      >
        {index + 1}
      </motion.span>
      <motion.div
        style={prefersReducedMotion ? undefined : { x, opacity }}
        className="pt-1.5"
      >
        <h3 className="font-serif text-lg text-ink md:text-2xl">{title}</h3>
        <p className="mt-2 max-w-xl text-[0.92rem] leading-relaxed text-brown/70">{body}</p>
      </motion.div>
    </li>
  )
}

export function TimelineSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 70%", "end 60%"] })
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="come-si-svolge" className="py-14 md:py-16">
      <div className="mx-auto max-w-4xl px-5 md:px-10 md:max-w-5xl">
        <h2 className="font-serif text-[1.7rem] text-ink md:text-3xl">Quattordici giorni. Quattro passaggi.</h2>

        <div ref={trackRef} className="relative mt-8 max-w-2xl md:mt-10 md:max-w-3xl">
          <div className="absolute left-5 top-1.5 bottom-1.5 z-0 w-[2px] bg-line" aria-hidden="true" />
          <motion.div
            className="absolute left-5 top-1.5 z-0 w-[2px] origin-top bg-copper"
            style={{ height: "calc(100% - 12px)", scaleY: prefersReducedMotion ? 1 : railScale }}
            aria-hidden="true"
          />
          <ol className="relative z-10">
            {STEPS.map((step, i) => (
              <Step key={step.title} index={i} title={step.title} body={step.body} />
            ))}
          </ol>
        </div>

        <div className="mt-10 max-w-2xl border-t border-line pt-7">
          <ul className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-[0.88rem] text-brown/70">
            {["Nessun diario", "Nessun aggiornamento quotidiano", "Nessun pet davanti alla videocamera", "Nessun programma complesso"].map(
              (item, i, arr) => (
                <li key={item}>
                  {item}
                  {i < arr.length - 1 && <span className="ml-2.5 text-copper">·</span>}
                </li>
              )
            )}
          </ul>
          <p className="mt-3.5 text-[0.82rem] text-brown/70">
            Tra gli incontri il canale di assistenza è dedicato ad appuntamenti e problemi tecnici.
          </p>
        </div>
      </div>
    </section>
  )
}
