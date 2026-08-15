import { Pricing } from "@/components/ui/single-pricing-card-1";

export function OfferSection() {
  return (
    <section id="percorso" className="scroll-mt-24 bg-background">
      <Pricing
        eyebrow="Percorso iniziale PetResona"
        title="3 incontri · €397 complessivi"
        price={397}
        priceNote="Pagamento unico per l'intero percorso iniziale"
        items={[
          "Questionario e raccolta iniziale",
          "Tre incontri da remoto",
          "Osservazione congiunta di animale, persona e ambiente",
          "Indicazioni per il seguito",
        ]}
        ctaLabel="Verifica disponibilità"
        ctaHref="#calendario"
        secondaryLines={["Singolo incontro: €140", "Mantenimento: €90 · 15–30 min, quando indicato"]}
      />
    </section>
  );
}
