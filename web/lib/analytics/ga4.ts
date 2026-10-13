import type { AnalyticsEvent } from "@/types/analytics";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let ga4Ready = false;

export const GA4_READY_EVENT = "frevity:ga4-ready";

export function getGa4MeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return id && /^G-[A-Z0-9]+$/.test(id) ? id : null;
}

export function isGa4Ready(): boolean {
  return ga4Ready;
}

export function setGa4Ready(ready: boolean): void {
  ga4Ready = ready;

  if (ready && typeof window !== "undefined") {
    window.dispatchEvent(new Event(GA4_READY_EVENT));
  }
}

export function sendGa4Event(event: AnalyticsEvent): void {
  if (
    typeof window === "undefined" ||
    !ga4Ready ||
    !window.gtag
  ) {
    return;
  }

  const measurementId = getGa4MeasurementId();

  if (
    !measurementId ||
    window[`ga-disable-${measurementId}`]
  ) {
    return;
  }

  window.gtag("event", event.name, {
    ...event.parameters,
    send_to: measurementId,
  });
}