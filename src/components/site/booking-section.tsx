"use client";

import { useState, FormEvent } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface QualificationData {
  animalType: string;
  situation: string;
  vetChecked: string;
  goal: string;
}

const TIME_SLOTS = [
  { time: "09:00", available: false },
  { time: "09:30", available: true },
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: false },
  { time: "11:30", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: true },
  { time: "15:00", available: false },
  { time: "15:30", available: true },
  { time: "16:00", available: true },
  { time: "16:30", available: true },
];

function QualificationForm({ onComplete }: { onComplete: (data: QualificationData) => void }) {
  const [errors, setErrors] = useState<Partial<Record<keyof QualificationData, string>>>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: QualificationData = {
      animalType: String(formData.get("animalType") ?? ""),
      situation: String(formData.get("situation") ?? ""),
      vetChecked: String(formData.get("vetChecked") ?? ""),
      goal: String(formData.get("goal") ?? ""),
    };

    const nextErrors: typeof errors = {};
    if (!data.animalType) nextErrors.animalType = "Seleziona cane o gatto.";
    if (!data.situation.trim()) nextErrors.situation = "Descrivi brevemente la situazione.";
    if (!data.goal.trim()) nextErrors.goal = "Racconta cosa vorreste osservare o capire.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onComplete(data);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
      <div className="grid gap-2">
        <label htmlFor="animalType" className="text-sm font-medium text-primary">
          1 · Che animale avete?
        </label>
        <select
          id="animalType"
          name="animalType"
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-primary"
          aria-invalid={Boolean(errors.animalType)}
          aria-describedby={errors.animalType ? "animalType-error" : undefined}
        >
          <option value="">Seleziona…</option>
          <option value="cane">Cane</option>
          <option value="gatto">Gatto</option>
        </select>
        {errors.animalType && (
          <p id="animalType-error" className="text-xs text-destructive">
            {errors.animalType}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="situation" className="text-sm font-medium text-primary">
          2 · Da quanto tempo osservate la situazione, e cosa avete notato?
        </label>
        <textarea
          id="situation"
          name="situation"
          rows={3}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-primary"
          aria-invalid={Boolean(errors.situation)}
          aria-describedby={errors.situation ? "situation-error" : undefined}
        />
        {errors.situation && (
          <p id="situation-error" className="text-xs text-destructive">
            {errors.situation}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <label htmlFor="vetChecked" className="text-sm font-medium text-primary">
          3 · C&apos;è già stata una valutazione veterinaria, se necessaria?
        </label>
        <select
          id="vetChecked"
          name="vetChecked"
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-primary"
        >
          <option value="">Seleziona…</option>
          <option value="si">Sì</option>
          <option value="no">No</option>
          <option value="non-necessaria">Non ritenuta necessaria</option>
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="goal" className="text-sm font-medium text-primary">
          4 · Cosa vorreste osservare o capire meglio?
        </label>
        <textarea
          id="goal"
          name="goal"
          rows={3}
          className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-primary"
          aria-invalid={Boolean(errors.goal)}
          aria-describedby={errors.goal ? "goal-error" : undefined}
        />
        {errors.goal && (
          <p id="goal-error" className="text-xs text-destructive">
            {errors.goal}
          </p>
        )}
      </div>

      <Button type="submit" className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90">
        Continua al calendario
      </Button>
    </form>
  );
}

function AppointmentPicker() {
  const today = new Date();
  const [date, setDate] = useState<Date>(today);
  const [time, setTime] = useState<string | null>(null);

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
                setTime(null);
              }
            }}
            locale={it}
            className="bg-transparent p-2 sm:pe-5"
            disabled={[{ before: today }]}
          />
          <div className="relative w-full max-sm:h-56 sm:w-44">
            <div className="absolute inset-0 border-border py-4 max-sm:border-t">
              <ScrollArea className="h-full border-border sm:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="text-sm font-medium text-primary">{format(date, "EEEE d MMMM", { locale: it })}</p>
                  </div>
                  <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                    {TIME_SLOTS.map(({ time: slot, available }) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        disabled={!available}
                        className={`w-full rounded-md border px-3 py-1.5 text-sm transition-colors ${
                          time === slot
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-transparent text-primary hover:border-[color:var(--color-accent-copper-text)] disabled:cursor-not-allowed disabled:opacity-35"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
        <li>
          <b className="text-primary">Fuso orario:</b> Europe/Rome (rilevato automaticamente)
        </li>
        <li>
          <b className="text-primary">Durata:</b> da confermare
        </li>
        <li>
          <b className="text-primary">Modalità:</b> online
        </li>
        <li>
          <b className="text-primary">Dopo la prenotazione:</b> email di conferma con istruzioni e questionario completo
        </li>
      </ul>

      <Button
        className="mt-5 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        disabled={!time}
      >
        {time ? `Conferma ${format(date, "d MMMM", { locale: it })} alle ${time}` : "Seleziona un orario"}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Collegamento al provider di prenotazione reale — da confermare.
      </p>
    </div>
  );
}

export function BookingSection() {
  const [qualified, setQualified] = useState(false);

  return (
    <section id="calendario" className="scroll-mt-24 bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <h2 className="font-serif text-3xl font-semibold text-primary md:text-4xl">
          Il primo passo è capire se PetResona è adatto a voi.
        </h2>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
          {qualified ? <AppointmentPicker /> : <QualificationForm onComplete={() => setQualified(true)} />}
        </div>
      </div>
    </section>
  );
}
