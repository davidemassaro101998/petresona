/**
 * Semantic conversion events. No analytics provider is connected — this
 * stub intentionally sends nothing. Never pass free-text form values, names,
 * emails or pet names.
 */
export type AnalyticsEvent =
  | "hero_cta_click"
  | "receive_item_open"
  | "offer_view"
  | "access_cta_click"
  | "continuity_cta_click"
  | "whatsapp_cta_click"
  | "system_node_open"
  | "faq_item_open"

export function track(event: AnalyticsEvent, detail?: Record<string, unknown>) {
  void event
  void detail
}
