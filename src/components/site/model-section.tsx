"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { TextRevealByWord } from "@/components/ui/text-reveal";

const NODES = [
  {
    key: "animale",
    label: "Animale",
    text: "Segnali, abitudini, storia e quotidianità.",
    image: "/images/petresona-model-animal.webp",
    alt: "Ritratto ravvicinato di un cane dallo sguardo calmo e attento.",
  },
  {
    key: "persona",
    label: "Persona",
    text: "Relazione, osservazioni e cambiamenti percepiti.",
    image: null,
  },
  {
    key: "ambiente",
    label: "Ambiente",
    text: "Ritmi, spazi e contesto in cui vive.",
    image: null,
  },
] as const;

function ModelStageDesktop() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const card0Opacity = useTransform(scrollYProgress, [0.15, 0.32], [0, 1]);
  const card0Scale = useTransform(scrollYProgress, [0.15, 0.32], [0.96, 1]);
  const card1Opacity = useTransform(scrollYProgress, [0.27, 0.44], [0, 1]);
  const card1Scale = useTransform(scrollYProgress, [0.27, 0.44], [0.96, 1]);
  const card2Opacity = useTransform(scrollYProgress, [0.39, 0.56], [0, 1]);
  const card2Scale = useTransform(scrollYProgress, [0.39, 0.56], [0.96, 1]);
  const cardOpacities = [card0Opacity, card1Opacity, card2Opacity];
  const cardScales = [card0Scale, card1Scale, card2Scale];
  const lineOpacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0.68, 0.8], [0, 1]);

  return (
    <div ref={ref} className="relative hidden min-h-[170vh] md:block">
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center overflow-hidden py-16">
        <p className="mb-10 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-accent-copper-text)]">
          Il modello PetResona
        </p>

        <div className="relative grid w-full max-w-4xl grid-cols-3 gap-6 px-8">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            <motion.line
              x1="17%"
              y1="50%"
              x2="50%"
              y2="50%"
              stroke="var(--color-accent-copper)"
              strokeWidth="1.5"
              style={{ opacity: lineOpacity }}
            />
            <motion.line
              x1="50%"
              y1="50%"
              x2="83%"
              y2="50%"
              stroke="var(--color-accent-copper)"
              strokeWidth="1.5"
              style={{ opacity: lineOpacity }}
            />
          </svg>

          {NODES.map((node, i) => (
            <motion.div
              key={node.key}
              style={{ opacity: cardOpacities[i], scale: cardScales[i] }}
              className="relative z-10 flex flex-col items-center gap-3 text-center"
            >
              {node.image ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] border border-border">
                  <Image src={node.image} alt={node.alt ?? node.label} fill className="object-cover" sizes="(max-width: 900px) 90vw, 30vw" />
                </div>
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-secondary/40 p-6">
                  <p className="font-serif text-lg text-primary">{node.label}</p>
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent-copper-text)]">
                {node.label}
              </p>
              <p className="max-w-[16rem] text-sm text-muted-foreground">{node.text}</p>
            </motion.div>
          ))}

          <motion.p
            style={{ opacity: wordmarkOpacity }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+2.2rem)] whitespace-nowrap font-serif text-sm text-primary"
          >
            PetResona
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function ModelStageMobile() {
  return (
    <div className="flex flex-col gap-6 md:hidden">
      {NODES.map((node, i) => (
        <motion.div
          key={node.key}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
        >
          {i > 0 && (
            <span className="absolute -top-6 left-8 h-6 w-px bg-[color:var(--color-accent-copper)]" aria-hidden="true" />
          )}
          {node.image ? (
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
              <Image src={node.image} alt={node.alt ?? node.label} fill className="object-cover" sizes="80px" />
            </div>
          ) : (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40">
              <span className="text-xs font-semibold text-[color:var(--color-accent-copper-text)]">{node.label}</span>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent-copper-text)]">
              {node.label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{node.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function ModelSection() {
  const reduced = useReducedMotion();

  return (
    <section id="modello" className="scroll-mt-24 bg-secondary/50 py-20 md:py-0">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <TextRevealByWord text="Un animale non vive isolato." />
      </div>
      {reduced ? (
        <div className="mx-auto max-w-4xl px-5 pb-16 md:px-8">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-accent-copper-text)]">
            Il modello PetResona
          </p>
          <ModelStageMobile />
        </div>
      ) : (
        <>
          <ModelStageDesktop />
          <div className="mx-auto max-w-4xl px-5 pb-16 md:hidden">
            <ModelStageMobile />
          </div>
        </>
      )}
    </section>
  );
}
