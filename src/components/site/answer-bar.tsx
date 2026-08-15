const ANSWERS = [
  "Per cani e gatti domestici",
  "Interamente a distanza",
  "Primo percorso: 3 incontri",
  "€397 complessivi",
  "Non sostituisce il veterinario",
];

export function AnswerBar() {
  return (
    <section className="bg-primary py-6 text-primary-foreground">
      <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-y-2 px-5 text-sm">
        {ANSWERS.map((item, i) => (
          <li key={item} className={`px-5 ${i > 0 ? "border-l border-primary-foreground/25" : ""}`}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
