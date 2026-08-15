import { RevealImageMask } from "@/components/ui/reveal-image-mask";

const SIGNALS = [
  "Cambiamenti nel comportamento o nelle abitudini.",
  "Situazioni che sembrano influenzate dal contesto domestico.",
  "Desiderio di affiancare al percorso veterinario un'osservazione complementare.",
];

export function RecognitionSection() {
  return (
    <section id="riconoscimento" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:items-start md:gap-16">
        <div>
          <h2 className="max-w-md font-serif text-3xl font-semibold leading-tight text-primary md:text-4xl">
            Quando senti che c&apos;è qualcosa da osservare più a fondo.
          </h2>
          <ul className="mt-8 flex flex-col border-t border-border">
            {SIGNALS.map((s, i) => (
              <li
                key={s}
                className="flex items-baseline gap-4 border-b border-border py-5"
                style={i === 1 ? { marginLeft: "clamp(0px, 6vw, 2.5rem)" } : undefined}
              >
                <span className="mt-2 h-px w-5 shrink-0 bg-[color:var(--color-accent-copper-text)]" />
                <p className="font-serif text-lg text-primary">{s}</p>
              </li>
            ))}
          </ul>
        </div>

        <RevealImageMask
          src="/images/petresona-recognition-cat.webp"
          alt="Gatto vigile e sereno che osserva il proprio ambiente domestico."
          shape="rounded"
          maskOrigin="30% 45%"
          className="!p-0 !bg-transparent"
        />
      </div>
    </section>
  );
}
