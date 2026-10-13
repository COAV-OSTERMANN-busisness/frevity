import type { Locale } from "@/types/i18n/types";

export interface AnalyticsEventMap {
  landing_view: {
    locale: Locale;
  };

  calculator_open: {
    locale: Locale;
  };

  calculation_started: {
    locale: Locale;
  };

  calculation_completed: {
    locale: Locale;
  };

  language_changed: {
    locale: Locale;
    previous_locale: Locale;
  };

  result_shared: {
    locale: Locale;
  };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEvent<
  T extends AnalyticsEventName = AnalyticsEventName,
> = {
  [K in T]: {
    name: K;
    parameters: AnalyticsEventMap[K];
  };
}[T];