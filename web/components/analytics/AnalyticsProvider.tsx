"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { usePrivacyConsent } from "@/components/privacy";
import { trackAnalyticsEvent } from "@/lib/analytics";

import type {
  AnalyticsEventMap,
  AnalyticsEventName,
} from "@/types/analytics";

interface AnalyticsContextValue {
  track: <T extends AnalyticsEventName>(
    name: T,
    parameters: AnalyticsEventMap[T]
  ) => void;
}

const AnalyticsContext =
  createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({
  children,
}: AnalyticsProviderProps) {
  const { consent } = usePrivacyConsent();

  const track = useCallback(
    <T extends AnalyticsEventName>(
      name: T,
      parameters: AnalyticsEventMap[T]
    ) => {
      trackAnalyticsEvent(
        name,
        parameters,
        consent.analytics === "granted"
      );
    },
    [consent.analytics]
  );

  const value = useMemo<AnalyticsContextValue>(
    () => ({ track }),
    [track]
  );

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);

  if (!context) {
    throw new Error(
      "useAnalytics must be used within AnalyticsProvider."
    );
  }

  return context;
}