/** Closing full-bleed moment right before the footer — the frequency
 * artwork edge-to-edge, paired with the "Non tocca. Si sintonizza." copy
 * that used to sit mid-page inside SistemaSection. Text lives over the
 * quieter left half of the image, where contrast is naturally good
 * without needing a scrim. */
export function FrequenzaClosingSection() {
  return (
    <section className="relative overflow-hidden bg-paper py-20 md:py-28">
      <img
        src="/assets/images/resonapet-frequenza-banner-v1.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-10">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-copper-text">
            Il ruolo della biorisonanza
          </p>
          <h2 className="mt-3 font-serif text-[length:var(--text-section)] leading-[1.15] text-ink">
            Non tocca. Si sintonizza.
          </h2>
          <div className="mt-5 max-w-lg text-[length:var(--text-body)] leading-relaxed text-brown/90">
            <p>
              L'energia non ha bisogno di contatto per essere letta. Ogni animale ha una sua
              firma energetica — un'antenna su cui il sistema di biorisonanza integrato
              ResonaPet si sintonizza, ovunque voi siate.
            </p>
            <p className="mt-4">
              Da lì legge tra un vastissimo campo di frequenze, portando alla luce ciò che
              ancora non si vede — spesso proprio quello che chi gli è vicino sentiva, senza
              saperlo spiegare.
            </p>
          </div>
          <p className="mt-4 max-w-lg text-[length:var(--text-small)] text-brown/75">
            Il lavoro di biorisonanza non produce diagnosi, referti o prescrizioni
            medico-veterinarie e non sostituisce il medico veterinario.
          </p>
        </div>
      </div>
    </section>
  )
}
