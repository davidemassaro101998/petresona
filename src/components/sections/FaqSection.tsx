import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { track } from "@/lib/analytics"

const FAQS = [
  {
    q: "Che ruolo ha la biorisonanza in PetResona Impronta?",
    a: "Giorgia utilizza il CIEM System durante la fase di preparazione per svolgere il lavoro di biorisonanza dedicato alla triade e preparare i tre elementi personali. Questo lavoro non ha finalità diagnostiche o veterinarie.",
  },
  {
    q: "Come può svolgersi a distanza?",
    a: "Il percorso utilizza il questionario, le fotografie del pet, tre incontri online e la fase di preparazione svolta personalmente da Giorgia. Il pet non deve partecipare alle videochiamate.",
  },
  {
    q: "Che cosa mi viene richiesto nei 14 giorni?",
    a: "Non sono richiesti diario, aggiornamenti giornalieri o programmi complessi. Le eventuali osservazioni vengono raccontate verbalmente nell'incontro conclusivo. Tra gli incontri il canale di assistenza è dedicato ad appuntamenti e problemi tecnici.",
  },
  {
    q: "Che cosa comprende il prezzo di €990?",
    a: "Il prezzo comprende la raccolta iniziale, tre incontri privati, l'esame dei materiali, il lavoro di biorisonanza con CIEM System, la preparazione di Traccia d'Ambiente, Codice Impronta e Guida Impronta, la consegna guidata e la sintesi finale.",
  },
  {
    q: "PetResona è un servizio veterinario?",
    a: "No. PetResona non effettua diagnosi, prescrizioni o trattamenti medico-veterinari e non sostituisce il medico veterinario.",
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <h2 className="font-serif text-[1.7rem] text-ink md:text-3xl">Prima di richiedere l'accesso.</h2>

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
              <AccordionContent className="max-w-[62ch] text-[0.9rem] leading-relaxed text-brown/70">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-14 border-t border-line pt-10 text-center md:mt-16 md:pt-12">
          <h2 className="mx-auto max-w-lg font-serif text-2xl text-ink md:text-3xl">
            Iniziamo da ciò che vivi ogni giorno con il tuo pet.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[0.95rem] text-brown/70">
            Raccontaci chi è e verifichiamo se PetResona Impronta è adatto alla vostra situazione.
          </p>
          <div className="mt-7 flex justify-center">
            <InteractiveHoverButton
              href="/richiedi-accesso.html"
              id="faq-closing-cta"
              onClick={() => track("access_cta_click")}
            >
              Richiedi accesso
            </InteractiveHoverButton>
          </div>
          <p className="mx-auto mt-5 max-w-md text-[0.78rem] leading-relaxed text-brown/70">
            La richiesta viene esaminata. Se PetResona Impronta è adatto alla situazione, riceverai
            contratto, informativa, indicazioni di pagamento e accesso agli appuntamenti.
          </p>
        </div>
      </div>
    </section>
  )
}
