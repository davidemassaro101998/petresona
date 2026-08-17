import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { motionTokens } from "@/styles/motion"
import { useReducedMotion } from "@/lib/use-reduced-motion"
import { track } from "@/lib/analytics"
import { PRICE_EUR, SHOW_PRICE } from "@/config/offer"

const INCLUDES = [
  "Questionario iniziale",
  "Fotografie e informazioni richieste",
  "Tre incontri online con Giorgia",
  "Lettura integrata di animale, persona e ambiente",
  "Elaborazione con CIEM System",
  "Restituzione personale",
  "Verifica e indicazioni finali",
  "Durata complessiva di 14 giorni",
]

export function OffertaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="offerta" className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <h2 className="max-w-2xl font-serif text-[length:var(--text-section)] leading-[1.15] text-ink">
          Quando questo percorso può essere adatto.
        </h2>
        <div className="mt-8 grid gap-9 md:grid-cols-2 md:gap-10">
          <div className="border-t border-copper pt-4">
            <h3 className="font-serif text-base font-semibold text-ink">Può essere adatto se</h3>
            <ul className="mt-3.5 grid gap-2.5 text-[length:var(--text-small)] leading-relaxed text-brown/90">
              <li>— Desideri un lavoro personale dedicato al tuo cane o gatto.</li>
              <li>— Vuoi considerare insieme animale, relazione e ambiente quotidiano.</li>
              <li>— Puoi fornire informazioni e fotografie del tuo pet.</li>
              <li>— Cerchi un percorso complementare, non una prestazione veterinaria.</li>
            </ul>
          </div>
          <div className="border-t border-line pt-4">
            <h3 className="font-serif text-base font-semibold text-ink">Non è indicato se</h3>
            <ul className="mt-3.5 grid gap-2.5 text-[length:var(--text-small)] leading-relaxed text-brown/90">
              <li>— Cerchi una diagnosi o una terapia veterinaria.</li>
              <li>— Ti trovi davanti a un'urgenza.</li>
              <li>— Vuoi sostituire o modificare le indicazioni del veterinario.</li>
              <li>— Cerchi la promessa di un risultato garantito.</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 max-w-[70ch] text-[length:var(--text-micro)] leading-relaxed text-brown/90">
          Ogni richiesta viene valutata per verificare che la situazione e il perimetro del
          percorso siano coerenti.
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
            <p className="text-[length:var(--text-small)] leading-relaxed text-ivory/85">
              Il lavoro principale avviene tra gli incontri: Giorgia esamina le informazioni
              raccolte e svolge l'elaborazione prevista con il CIEM System.
            </p>

            {SHOW_PRICE && (
              <>
                <h3 className="mt-10 font-serif text-3xl md:text-5xl">
                  {prefersReducedMotion || !inView ? (
                    prefersReducedMotion && `€${PRICE_EUR}`
                  ) : (
                    <VerticalCutReveal
                      splitBy="characters"
                      staggerDuration={0.04}
                      staggerFrom="first"
                      transition={{ type: "spring", stiffness: 160, damping: 24 }}
                      autoStart
                    >
                      {`€${PRICE_EUR}`}
                    </VerticalCutReveal>
                  )}
                </h3>
                <p className="mt-2 text-sm text-ivory/80">
                  ResonaPet · Esperienza personale di 14 giorni · Pagamento unico
                </p>
              </>
            )}

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
                  Richiedi l'accesso
              </InteractiveHoverButton>
            </div>
            <p className="mx-auto mt-5 max-w-md text-[length:var(--text-micro)] leading-relaxed text-ivory/80">
              La richiesta non comporta un acquisto automatico. Dopo la verifica riceverai
              contratto, informativa, indicazioni di pagamento e accesso agli appuntamenti.
            </p>
            <p className="mx-auto mt-3 max-w-md text-[length:var(--text-micro)] leading-relaxed text-ivory/80">
              ResonaPet non effettua diagnosi, prescrizioni o trattamenti medico-veterinari e non
              sostituisce il medico veterinario.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
