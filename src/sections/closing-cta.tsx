export function ClosingCta() {
  return (
    <section className="bg-[color:var(--plum-deep)] py-20 text-center text-primary-foreground md:py-28">
      <div className="mx-auto max-w-xl px-5 md:px-8">
        <h2 className="font-serif text-3xl font-semibold md:text-4xl">Iniziamo da ciò che osservi ogni giorno.</h2>
        <p className="mt-4 text-primary-foreground/75">
          Raccontaci la situazione e verifica il primo appuntamento disponibile.
        </p>
        <a
          href="#calendario"
          className="mt-8 inline-flex rounded-full bg-[color:var(--color-accent-copper)] px-7 py-3.5 text-sm font-semibold text-primary hover:bg-[color:var(--color-accent-copper-text)] hover:text-primary-foreground"
        >
          Verifica e prenota
        </a>
      </div>
    </section>
  );
}
