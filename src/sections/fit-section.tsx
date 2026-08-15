export function FitSection() {
  return (
    <section id="per-chi" className="scroll-mt-24 bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2 className="mb-10 font-serif text-3xl font-semibold text-primary md:text-4xl">Per chi è, per chi non è</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border-l-[3px] border-[color:var(--color-accent-copper-text)] bg-card p-8">
            <h3 className="mb-4 text-lg font-semibold text-primary">È adatto a chi</h3>
            <ul className="grid gap-2.5 text-sm text-muted-foreground">
              <li>Desidera un percorso complementare e da remoto</li>
              <li>È disponibile a descrivere il contesto con precisione</li>
              <li>Comprende che non si tratta di medicina veterinaria</li>
            </ul>
          </div>
          <div className="rounded-2xl border-l-[3px] border-border bg-transparent p-8">
            <h3 className="mb-4 text-lg font-semibold text-primary">Non è adatto a chi</h3>
            <ul className="grid gap-2.5 text-sm text-muted-foreground">
              <li>Cerca una diagnosi o una terapia veterinaria</li>
              <li>Si trova davanti a un&apos;urgenza</li>
              <li>Pretende un risultato garantito</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
