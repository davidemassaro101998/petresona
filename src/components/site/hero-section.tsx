"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

function StaticHero({ animated }: { animated: boolean }) {
  return (
    <section
      id="hero-root"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center gap-8 overflow-hidden bg-primary px-6 pb-16 pt-24 text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">
        Percorso a distanza per cani e gatti
      </p>
      <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.05] text-primary-foreground md:text-6xl">
        Ascoltiamo ciò che il tuo animale non può raccontare.
      </h1>
      <p className="max-w-xl text-primary-foreground/80">
        PetResona è un percorso di biorisonanza a distanza che considera insieme animale, persona e ambiente.
      </p>
      <div
        className={`relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-3xl ${
          animated ? "scale-[0.96] opacity-0 animate-[hero-settle_0.7s_0.1s_ease-out_forwards]" : ""
        }`}
      >
        <Image
          src="/images/petresona-hero-dog-home.webp"
          alt="Cane tranquillo e attento nel proprio ambiente domestico."
          fill
          className="object-cover"
          style={{ objectPosition: "63% center" }}
          priority
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href="#calendario"
          className="rounded-full bg-[color:var(--color-accent-copper)] px-6 py-3 text-sm font-semibold text-primary"
        >
          Verifica se è adatto a voi
        </a>
        <a
          href="#come-funziona"
          className="rounded-full border border-primary-foreground/30 px-6 py-3 text-sm text-primary-foreground"
        >
          Scopri come funziona
        </a>
      </div>
      <p className="text-xs text-primary-foreground/60">
        Online · Primo percorso di 3 incontri · Approccio complementare
      </p>
      <style jsx>{`
        @keyframes hero-settle {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}

export function HeroSection() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  // Mobile never gets the long scroll-hijacked expansion (perf + no pin on touch);
  // it gets a gentle one-time settle-in instead, unless reduced-motion is set too.
  if (reduced || !isDesktop) {
    return <StaticHero animated={!reduced} />;
  }

  return (
    <div id="hero-root">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/images/petresona-hero-dog-home.webp"
        bgImageSrc="/images/petresona-hero-dog-home.webp"
        title="Ascoltiamo ciò che il tuo animale non può raccontare."
        scrollToExpand="Animale. Persona. Ambiente."
        textBlend={false}
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-accent-copper-text)]">
            Percorso a distanza per cani e gatti
          </p>
          <p className="text-primary/80">
            PetResona è un percorso di biorisonanza a distanza che considera insieme animale, persona e ambiente.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#calendario"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Verifica se è adatto a voi
            </a>
            <a
              href="#come-funziona"
              className="rounded-full border border-border px-6 py-3 text-sm text-primary hover:border-[color:var(--color-accent-copper-text)]"
            >
              Scopri come funziona
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            Online · Primo percorso di 3 incontri · Approccio complementare
          </p>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
