import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"

const INCLUDES = [
  "Questionario e primo incontro privato",
  "Valutazione delle informazioni e delle fotografie",
  "Elaborazione professionale di Giorgia",
  "Traccia d'Ambiente personale",
  "Codice Impronta",
  "Guida Impronta",
  "Secondo incontro di consegna guidata",
  "Terzo incontro di sintesi",
  "14 giorni complessivi",
]

export function OffertaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="offerta" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <h2 className="max-w-2xl font-serif text-[1.9rem] leading-[1.15] text-ink md:text-4xl">
          Non è un percorso per tutti.
        </h2>
        <div className="mt-8 grid gap-9 md:grid-cols-2 md:gap-10">
          <div className="border-t border-copper pt-4">
            <h3 className="font-serif text-base font-semibold text-ink">È per voi se</h3>
            <ul className="mt-3.5 grid gap-2.5 text-[0.9rem] leading-relaxed text-brown/75">
              <li>— Desideri un'esperienza personale dedicata al tuo cane o gatto.</li>
              <li>— Vuoi considerare insieme pet, relazione e ambiente quotidiano.</li>
              <li>— Puoi fornire informazioni e fotografie del tuo pet.</li>
              <li>— Comprendi il perimetro non veterinario del servizio.</li>
            </ul>
          </div>
          <div className="border-t border-line pt-4">
            <h3 className="font-serif text-base font-semibold text-ink">Non è la scelta giusta se</h3>
            <ul className="mt-3.5 grid gap-2.5 text-[0.9rem] leading-relaxed text-brown/75">
              <li>— Non è adatto se cerchi una diagnosi o una terapia veterinaria.</li>
              <li>— Non è adatto in presenza di un'urgenza.</li>
              <li>— Non è adatto se desideri modificare indicazioni del veterinario.</li>
              <li>— Non è adatto se cerchi un risultato garantito.</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 max-w-[70ch] text-[0.82rem] leading-relaxed text-brown/70">
          La richiesta viene valutata per verificare che situazione, materiali disponibili e
          perimetro del servizio siano coerenti con l'esperienza.
        </p>
      </div>

      <div ref={ref} className="relative mt-14 overflow-hidden md:mt-16">
        <motion.div
          initial={prefersReducedMotion ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
          animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
          transition={{ duration: motionTokens.scene, ease: motionTokens.easeOut as unknown as [number, number, number, number] }}
          className="bg-ink px-5 py-16 text-ivory md:px-10 md:py-24"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[0.95rem] leading-relaxed text-ivory/70">
              Il lavoro principale avviene tra gli incontri: Giorgia esamina i materiali, svolge
              l'elaborazione con CIEM System e prepara Traccia d'Ambiente, Codice Impronta e Guida
              Impronta per la consegna personale.
            </p>

            <h3 className="mt-10 font-serif text-3xl md:text-5xl">
              {prefersReducedMotion || !inView ? (
                prefersReducedMotion && "€990"
              ) : (
                <VerticalCutReveal
                  splitBy="characters"
                  staggerDuration={0.04}
                  staggerFrom="first"
                  transition={{ type: "spring", stiffness: 160, damping: 24 }}
                  autoStart
                >
                  €990
                </VerticalCutReveal>
              )}
            </h3>
            <p className="mt-2 text-sm text-ivory/60">
              PetResona Impronta · Esperienza personale di 14 giorni · Pagamento unico
            </p>

            <ul className="mx-auto mt-8 grid max-w-md gap-2 text-left text-[0.88rem] text-ivory/80">
              {INCLUDES.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="text-copper-light">—</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex justify-center">
              <InteractiveHoverButton
                href="/richiedi-accesso.html"
                onClick={() => track("access_cta_click")}
                className="border-copper-light/40 bg-transparent text-ivory"
              >
                Richiedi accesso
              </InteractiveHoverButton>
            </div>
            <p className="mx-auto mt-5 max-w-md text-[0.78rem] leading-relaxed text-ivory/70">
              La richiesta non comporta un acquisto automatico. Dopo la verifica riceverai
              contratto, informativa, indicazioni di pagamento e accesso agli appuntamenti.
            </p>
            <p className="mx-auto mt-3 max-w-md text-[0.72rem] leading-relaxed text-ivory/65">
              PetResona non effettua diagnosi, prescrizioni o trattamenti medico-veterinari e non
              sostituisce il medico veterinario.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
