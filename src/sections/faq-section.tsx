import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    id: "1",
    q: "Come può svolgersi a distanza?",
    a: "Attraverso la raccolta di informazioni e fotografie dell'animale, seguita dalle tre sessioni online.",
  },
  {
    id: "2",
    q: "Devo portare il mio animale davanti alla videocamera?",
    a: "No, non è richiesto. Servono informazioni e fotografie, non una presenza in videochiamata.",
  },
  {
    id: "3",
    q: "È una visita veterinaria?",
    a: "No. È un servizio complementare e non sostituisce la valutazione, la diagnosi o il trattamento del medico veterinario.",
  },
  {
    id: "4",
    q: "Cosa comprende il percorso di tre incontri?",
    a: "Questionario e raccolta iniziale, tre incontri da remoto, osservazione congiunta di animale-persona-ambiente e indicazioni per il seguito.",
  },
  {
    id: "5",
    q: "Come preparo il primo incontro?",
    a: "Compilando il questionario iniziale e inviando le fotografie richieste — le indicazioni precise arrivano dopo la prenotazione.",
  },
  {
    id: "6",
    q: "Cosa succede dopo i tre incontri?",
    a: "Una sintesi del percorso e, se utile, una valutazione dell'eventuale mantenimento.",
  },
  {
    id: "7",
    q: "Come funzionano pagamento, spostamenti e cancellazioni?",
    a: "Da confermare con il provider di prenotazione scelto — sarà indicato chiaramente prima della conferma.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <h2 className="mb-8 font-serif text-3xl font-semibold text-primary md:text-4xl">Domande frequenti</h2>
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="py-1">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="flex flex-1 items-center gap-3 py-4 text-left font-serif text-lg font-medium text-primary transition-all [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&>svg]:-order-1 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0 [&[data-state=open]>svg]:rotate-180">
                {item.q}
                <Plus
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-[color:var(--color-accent-copper-text)] transition-transform duration-200"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pb-4 ps-7 text-sm text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
