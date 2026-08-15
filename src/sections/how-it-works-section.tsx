import { HowItWorks } from "@/components/ui/how-it-works";

const STEPS = [
  {
    title: "Racconti la situazione",
    description: "Un breve questionario iniziale e le informazioni utili sul cane o gatto e sul suo contesto.",
  },
  {
    title: "Incontrate Giorgia online",
    description: "Tre sessioni da remoto, guidate con chiarezza.",
  },
  {
    title: "Ricevi indicazioni per il seguito",
    description: "Sintesi del percorso ed eventuale mantenimento, se utile.",
  },
];

const PETRESONA_COLORS = {
  bg: "bg-[color:var(--color-surface)]",
  text: "text-[color:var(--color-accent-copper-text)]",
  border: "border-border",
};

const POSITIONS = [
  { className: "md:absolute md:top-1/2 md:left-[8%] md:-translate-y-1/2", rotate: "" },
  { className: "md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2", rotate: "" },
  { className: "md:absolute md:top-1/2 md:right-[8%] md:-translate-y-1/2", rotate: "" },
];

export function HowItWorksSection() {
  return (
    <section id="come-funziona" className="scroll-mt-24 bg-background">
      <div className="mx-auto max-w-6xl px-5 pt-20 md:px-8">
        <h2 className="font-serif text-3xl font-semibold text-primary md:text-4xl">Come funziona</h2>
      </div>
      <HowItWorks
        className="bg-background !py-10 md:!py-14"
        features={STEPS.map((s) => ({ ...s, colors: PETRESONA_COLORS }))}
        stepPositions={POSITIONS}
      />
    </section>
  );
}
