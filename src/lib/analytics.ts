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
  | "application_view"
  | "application_start"
  | "application_submit_success"
  | "application_submit_error"
  | "system_node_open"
  | "faq_item_open"

export function track(event: AnalyticsEvent, detail?: Record<string, unknown>) {
  void event
  void detail
}
