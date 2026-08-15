"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function GiorgiaSection() {
  return (
    <section id="giorgia" className="scroll-mt-24 bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.8fr_1.2fr] md:items-center md:gap-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-border"
        >
          <Image
            src="/images/petresona-giorgia-studio.webp"
            alt="Giorgia Bisognini nel suo ambiente professionale."
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 900px) 90vw, 40vw"
          />
        </motion.div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-accent-copper-text)]">
            Una guida umana, un percorso preciso
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-primary md:text-4xl">Giorgia Bisognini</h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            35 anni di esperienza infermieristica, oggi dedicata alla biorisonanza per cani e gatti. Ha creato
            PetResona partendo da un&apos;idea semplice: un animale non va osservato da solo, ma insieme a chi vive
            con lui e all&apos;ambiente che lo circonda.
          </p>
          <div className="mt-5 grid gap-1.5 text-sm text-muted-foreground">
            <span>Infermiera · 35 anni di esperienza</span>
            <span>Kinesiologa, posturologa, operatrice di biorisonanza</span>
            <span>Titolare da oltre 30 anni di un centro olistico</span>
          </div>
        </div>
      </div>
    </section>
  );
}
