// Sezione predisposta ma non ancora attivata pubblicamente: con il flag a
// false non deve produrre markup né spazio verticale.
export const VET_COLLAB_ENABLED = false

type VetCollaboration = {
  name: string
  title: string
  portraitSrc: string
  directExperience: string
  collaborationText: string
  quote?: string
}

// Dati previsti per quando la sezione verrà attivata con informazioni
// ufficiali. Non ancora renderizzati: vedi VET_COLLAB_ENABLED.
const VET: VetCollaboration = {
  name: "",
  title: "",
  portraitSrc: "",
  directExperience: "esperienza diretta della veterinaria con il proprio cane",
  collaborationText:
    "ResonaPet nasce per affiancare, non sostituire, il lavoro veterinario. La collaborazione permette, quando opportuno e con il consenso del proprietario, di mantenere un confronto chiaro tra il percorso ResonaPet e la salute dell'animale.",
}

export function VeterinariaSection() {
  if (!VET_COLLAB_ENABLED) return null

  return (
    <section id="collaborazione-veterinaria" className="bg-ivory py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-14 md:px-10">
        <div className="aspect-[4/5] overflow-hidden rounded-[24px] bg-line/20">
          {VET.portraitSrc && (
            <img src={VET.portraitSrc} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="border-l border-copper/30 pl-6 md:pl-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-copper">
            Collaborazione professionale
          </p>
          <h2 className="mt-3 font-serif text-[length:var(--text-section)] text-ink">
            Un dialogo che include anche la prospettiva veterinaria.
          </h2>
          <p className="mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-brown/80">
            {VET.collaborationText}
          </p>
          <ul className="mt-6 grid gap-2.5 text-[length:var(--text-small)] leading-relaxed text-brown/90">
            <li>— {VET.directExperience}</li>
            <li>— Collaborazione professionale reale.</li>
            <li>— Invio reciproco nel rispetto dei diversi ambiti.</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
