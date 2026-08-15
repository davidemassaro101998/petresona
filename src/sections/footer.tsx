export function Footer() {
  return (
    <footer className="border-t border-border px-5 py-12 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-6 text-sm text-muted-foreground">
        <span className="font-serif text-lg text-primary">
          Pet<span className="text-[color:var(--color-accent-copper-text)] font-semibold">Resona</span>
        </span>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <a href="#" className="hover:text-[color:var(--color-accent-copper-text)]">Instagram</a>
          <a href="#" className="hover:text-[color:var(--color-accent-copper-text)]">TikTok</a>
          <a href="#" className="hover:text-[color:var(--color-accent-copper-text)]">Facebook</a>
          <a href="/privacy" className="hover:text-[color:var(--color-accent-copper-text)]">Privacy Policy</a>
          <a href="/cookie" className="hover:text-[color:var(--color-accent-copper-text)]">Cookie Policy</a>
          <a href="/termini" className="hover:text-[color:var(--color-accent-copper-text)]">Termini e condizioni</a>
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-3xl border-t border-border pt-5 text-xs text-muted-foreground">
        PetResona è un servizio complementare e non sostituisce la valutazione, la diagnosi o il trattamento del
        medico veterinario. In presenza di sintomi, urgenze o problemi di salute, è necessario rivolgersi al medico
        veterinario.
      </p>
      <p className="mt-4 text-[11px] text-muted-foreground/70">
        Dati societari e contatti — da confermare · © {new Date().getFullYear()} PetResona
      </p>
    </footer>
  );
}
