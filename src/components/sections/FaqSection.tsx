import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { track } from "@/lib/analytics"
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

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-20">
      {/* Mobile: the cat photo runs edge-to-edge instead of a small boxed
          image, so it reads as a real photo instead of a cramped thumbnail
          next to the accordion. */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] mb-10 aspect-[4/3] w-screen md:hidden">
        <img
          src="/assets/images/resonapet-cat-desktop-v2.webp"
          alt="Gatto seduto su un divano, osservando lo spazio domestico intorno a sé."
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="md:grid md:grid-cols-[42%_1fr]">
        <div className="relative hidden md:block">
          <img
            src="/assets/images/resonapet-cat-desktop-v2.webp"
            alt="Gatto seduto su un divano, osservando lo spazio domestico intorno a sé."
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="px-5 md:px-12 md:py-4 lg:px-16">
          <h2 className="font-serif text-[length:var(--text-section)] text-ink">Le domande più importanti.</h2>

          <Accordion
            type="single"
            collapsible
            defaultValue="item-0"
            className="mt-6"
            onValueChange={(v) => v && track("faq_item_open", { item: v })}
          >
            {FAQS.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="border-line data-[state=open]:border-b-copper"
              >
                <AccordionTrigger className="font-serif text-[1.02rem] text-ink hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[62ch] text-[length:var(--text-small)] leading-relaxed text-brown/90">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
