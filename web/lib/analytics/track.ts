import type {
    AnalyticsEvent,
    AnalyticsEventName,
    AnalyticsEventMap,
  } from "@/types/analytics";
  
  import { sendGa4Event } from "./ga4";
  
  export function trackAnalyticsEvent<T extends AnalyticsEventName>(
    name: T,
    parameters: AnalyticsEventMap[T],
    analyticsAllowed: boolean
  ): void {
    if (!analyticsAllowed) {
      return;
    }
  
    sendGa4Event({
      name,
      parameters,
    } as AnalyticsEvent);
  }