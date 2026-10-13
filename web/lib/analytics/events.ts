import type {
    AnalyticsEvent,
    AnalyticsEventName,
  } from "@/types/analytics";
  
  export const ANALYTICS_EVENTS = [
    "landing_view",
    "calculator_open",
    "calculation_started",
    "calculation_completed",
    "language_changed",
    "result_shared",
  ] as const satisfies readonly AnalyticsEventName[];
  
  export function isAnalyticsEventName(
    value: unknown
  ): value is AnalyticsEventName {
    return ANALYTICS_EVENTS.some((name) => name === value);
  }
  
  export function createAnalyticsEvent<T extends AnalyticsEventName>(
    event: AnalyticsEvent<T>
  ): AnalyticsEvent<T> {
    return event;
  }