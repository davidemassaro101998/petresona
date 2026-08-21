import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { SHOW_PRICE, PRICE_EUR } from "@/config/offer"
import { WHATSAPP_LINK_GENERAL } from "@/config/contact"

const FAQS = [
  {
    q: "Come si svolge il percorso a distanza?",
    a: "Il percorso utilizza un questionario, le fotografie del pet, tre incontri online e il lavoro svolto personalmente da Giorgia tra un incontro e l'altro.",
  },
  {
    q: "Il mio animale deve essere presente durante gli incontri?",
    a: "No. Il pet non deve partecipare alle videochiamate. Le informazioni e le fotografie richieste vengono raccolte prima del percorso.",
  },
  {
    q: "Che cosa dovrò inviare?",
    a: "Verranno richiesti il questionario compilato e alcune fotografie del pet. Non sono richieste fotografie o video del proprietario.",
  },
  {
    q: "Quanto tempo richiede al proprietario?",
    a: "Non sono richiesti un diario o aggiornamenti quotidiani. Le osservazioni vengono condivise verbalmente durante l'incontro conclusivo.",
  },
  {
    q: "Qual è il ruolo della biorisonanza?",
    a: "Giorgia utilizza la tecnologia di biorisonanza integrata ResonaPet nella fase di elaborazione personale. Il lavoro non ha finalità diagnostiche o medico-veterinarie.",
  },
  {
    q: "ResonaPet sostituisce il veterinario?",
    a: "No. ResonaPet non effettua diagnosi, prescrizioni o trattamenti medico-veterinari e non sostituisce il medico veterinario.",
  },
  ...(SHOW_PRICE
    ? [
        {
          q: `Che cosa comprende il prezzo di €${PRICE_EUR}?`,
          a: "Il prezzo comprende il questionario iniziale, tre incontri online con Giorgia, la lettura integrata di animale, persona e ambiente, l'elaborazione con la tecnologia di biorisonanza integrata ResonaPet, l'audio frequenziale personalizzato e il Codice di Coerenza, fino alla restituzione personale e alla verifica finale.",
        },
      ]
    : []),
]

/** Rendered twice (mobile plain, desktop overlaid on the photo) since the
 * color treatment differs enough that sharing via className alone would
 * be messier than just parameterizing it. Only one copy is ever visible
 * at a given breakpoint (the other is display:none, so no duplicate
 * interaction/tracking risk). */
function FaqAccordion({ dark }: { dark: boolean }) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-0"
      className={cn("mt-6", dark && "[&_svg]:text-ivory/70")}
      onValueChange={(v) => v && track("faq_item_open", { item: v })}
    >
      {FAQS.map((item, i) => (
        <AccordionItem
          key={item.q}
          value={`item-${i}`}
          className={dark ? "border-ivory/25 data-[state=open]:border-b-copper-light" : "border-line data-[state=open]:border-b-copper"}
        >
          <AccordionTrigger
            className={cn(
              "font-serif text-[1.02rem] hover:no-underline",
              dark ? "text-ivory drop-shadow-[0_2px_8px_rgba(35,20,15,0.55)]" : "text-ink",
            )}
          >
            {item.q}
          </AccordionTrigger>
          <AccordionContent
            className={cn(
              "max-w-[62ch] text-[length:var(--text-small)] leading-relaxed",
              dark ? "text-ivory/90 drop-shadow-[0_1px_6px_rgba(35,20,15,0.5)]" : "text-brown/90",
            )}
          >
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-20">
      {/* Mobile: kept simple — the cat photo runs edge-to-edge above a
          plain-background accordion, instead of trying to fit an
          interactive overlay on a photo on a small screen. */}
      <div className="md:hidden">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] mb-10 aspect-[4/5] w-screen">
          <img
            src="/assets/images/resonapet-cat-faq-v1.webp"
            alt="Gatto tigrato seduto su una mensola in legno, accanto a un vaso in terracotta."
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="px-5">
          <h2 className="font-serif text-[length:var(--text-section)] text-ink">Le domande più importanti.</h2>
          <FaqAccordion dark={false} />
        </div>
      </div>

      {/* Desktop: full-bleed edge-to-edge, same principle as "Lo riconosci?" —
          the FAQ sits directly on the photo with a strong scrim for contrast. */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] hidden w-screen md:block">
        <div className="relative min-h-[720px]">
          <img
            src="/assets/images/resonapet-cat-faq-wide-v1.webp"
            alt="Gatto tigrato seduto su una mensola in legno, accanto a un vaso in terracotta."
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brown-deep via-brown-deep/78 to-brown-deep/15" />
          <div className="relative mx-auto max-w-6xl px-5 py-16 md:px-10">
            <div className="max-w-xl">
              <h2 className="font-serif text-[length:var(--text-section)] text-ivory drop-shadow-[0_2px_10px_rgba(35,20,15,0.5)]">
                Le domande più importanti.
              </h2>
              <FaqAccordion dark />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mx-auto mt-14 max-w-3xl border-t border-line pt-10 text-center md:mt-16 md:pt-12">
          <h2 className="mx-auto max-w-lg font-serif text-2xl text-ink md:text-3xl">
            Iniziamo da ciò che vivi ogni giorno con il tuo pet.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[length:var(--text-small)] leading-relaxed text-brown/90">
            Raccontaci la situazione e verifichiamo se ResonaPet è adatto al vostro contesto.
          </p>
          <div className="mt-7 flex justify-center">
            <InteractiveHoverButton
              href={WHATSAPP_LINK_GENERAL}
              target="_blank"
              rel="noreferrer"
              id="faq-closing-cta"
              onClick={() => track("access_cta_click")}
            >
              Richiedi l'accesso
            </InteractiveHoverButton>
          </div>
          <p className="mx-auto mt-5 max-w-md text-[length:var(--text-micro)] leading-relaxed text-brown/90">
            La richiesta viene esaminata. Se ResonaPet è adatto alla situazione, riceverai
            contratto, informativa, indicazioni di pagamento e accesso agli appuntamenti.
          </p>
        </div>
      </div>
    </section>
  )
}
