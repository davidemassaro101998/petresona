import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useReducedMotion } from "@/lib/use-reduced-motion"

const STEPS = [
  {
    title: "Stabilità",
    body: "Lavoriamo su di te e sul contesto in cui vive il tuo pet, per creare calma in casa e una routine prevedibile. Ricevi un audio ambientale personalizzato e il Codice di Coerenza, da posizionare in cuccia, ciotole o trasportino.",
  },
  {
    title: "Emozione",
    body: "Ci occupiamo dei trigger e dell'ambiente quotidiano per ridurne il carico e aumentare la prevedibilità, con un ribilanciamento dell'audio frequenziale costruito sul caso specifico.",
  },
  {
    title: "Vitalità",
    body: "Consolidiamo le abitudini e la qualità della relazione, con attenzione al movimento e alla routine, fino alla restituzione finale e alle indicazioni di mantenimento.",
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
        <p className="mt-2 max-w-xl text-[length:var(--text-small)] leading-relaxed text-brown/90">{body}</p>
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
        <h2 className="font-serif text-[length:var(--text-section)] text-ink">Tre sedute. Un percorso su misura.</h2>

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
          <p className="text-[length:var(--text-small)] leading-relaxed text-brown/90">
            Nessun diario quotidiano e nessuna reperibilità continua: il lavoro richiesto al
            proprietario rimane semplice e sostenibile.
          </p>
        </div>
      </div>
    </section>
  )
}
