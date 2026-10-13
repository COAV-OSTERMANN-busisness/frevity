"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_PRIVACY_CONSENT,
  readPrivacyConsent,
  savePrivacyConsent,
} from "@/lib/privacy";

import type {
  ConsentContextValue,
  PrivacyConsent,
} from "@/types/analytics";

const ConsentContext =
  createContext<ConsentContextValue | null>(null);

interface ConsentProviderProps {
  children: ReactNode;
}

export function ConsentProvider({
  children,
}: ConsentProviderProps) {
  const [consent, setConsent] = useState<PrivacyConsent>(
    DEFAULT_PRIVACY_CONSENT
  );

  useEffect(() => {
    setConsent(readPrivacyConsent());
  }, []);

  const acceptAll = useCallback(() => {
    setConsent(savePrivacyConsent("granted"));
  }, []);

  const acceptEssentialOnly = useCallback(() => {
    setConsent(savePrivacyConsent("denied"));
  }, []);

  const revokeAnalytics = useCallback(() => {
    setConsent(savePrivacyConsent("denied"));
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      acceptAll,
      acceptEssentialOnly,
      revokeAnalytics,
    }),
    [
      consent,
      acceptAll,
      acceptEssentialOnly,
      revokeAnalytics,
    ]
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
    </ConsentContext.Provider>
  );
}

export function usePrivacyConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error(
      "usePrivacyConsent must be used within ConsentProvider."
    );
  }

  return context;
}