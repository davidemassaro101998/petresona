/**
 * Semantic conversion events carried over from V3/V4, plus the
 * `booking_preview_*` events added for the beta booking flow. No analytics
 * provider is connected — this stub intentionally sends nothing. Never pass
 * free-text form values, names, emails, pet names, selected dates, or
 * selected times.
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
  | "imprint_node_open"
  | "showcase_item_change"
  | "faq_item_open"
  | "booking_preview_start"
  | "booking_preview_application_valid"
  | "booking_preview_review"
  | "booking_preview_approved"
  | "booking_preview_date_selected"
  | "booking_preview_time_selected"
  | "booking_preview_summary"
  | "booking_preview_complete"
  | "booking_preview_restart"

export function track(event: AnalyticsEvent, detail?: Record<string, unknown>) {
  void event
  void detail
}
