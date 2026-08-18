// Numero WhatsApp di Giorgia, formato internazionale senza "+".
export const WHATSAPP_NUMBER = "393494248794"
export const SHOW_WHATSAPP_CTA = true

// Il sito è una vetrina senza raccolta dati: nessun modulo, nessun dato
// personale passa dal sito. Ogni CTA apre WhatsApp con un messaggio già
// scritto (nessun dato inserito da chi visita), che resta modificabile
// da WhatsApp prima dell'invio.
function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export const WHATSAPP_LINK_GENERAL = whatsappLink(
  "🐾 Ciao Giorgia, vorrei ricevere informazioni su ResonaPet."
)
export const WHATSAPP_LINK_CORE = whatsappLink(
  "🐾 Ciao Giorgia, vorrei ricevere informazioni su ResonaPet CORE."
)
export const WHATSAPP_LINK_CONTINUITY = whatsappLink(
  "🐾 Ciao Giorgia, vorrei ricevere informazioni su ResonaPet Continuity."
)
