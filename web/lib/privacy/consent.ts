import type {
    AnalyticsConsentStatus,
    PrivacyConsent,
  } from "@/types/analytics";
  
  const CONSENT_STORAGE_KEY = "frevity:privacy-consent:v1";
  
  export const DEFAULT_PRIVACY_CONSENT: PrivacyConsent = {
    essential: true,
    analytics: "pending",
    updatedAt: null,
  };
  
  function isAnalyticsConsentStatus(
    value: unknown
  ): value is AnalyticsConsentStatus {
    return (
      value === "pending" ||
      value === "granted" ||
      value === "denied"
    );
  }
  
  export function readPrivacyConsent(): PrivacyConsent {
    if (typeof window === "undefined") {
      return DEFAULT_PRIVACY_CONSENT;
    }
  
    try {
      const stored = window.localStorage.getItem(
        CONSENT_STORAGE_KEY
      );
  
      if (!stored) {
        return DEFAULT_PRIVACY_CONSENT;
      }
  
      const parsed: unknown = JSON.parse(stored);
  
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("analytics" in parsed) ||
        !isAnalyticsConsentStatus(parsed.analytics) ||
        !("updatedAt" in parsed) ||
        (parsed.updatedAt !== null &&
          typeof parsed.updatedAt !== "string")
      ) {
        return DEFAULT_PRIVACY_CONSENT;
      }
  
      return {
        essential: true,
        analytics: parsed.analytics,
        updatedAt: parsed.updatedAt,
      };
    } catch {
      return DEFAULT_PRIVACY_CONSENT;
    }
  }
  
  export function savePrivacyConsent(
    analytics: Exclude<AnalyticsConsentStatus, "pending">
  ): PrivacyConsent {
    const consent: PrivacyConsent = {
      essential: true,
      analytics,
      updatedAt: new Date().toISOString(),
    };
  
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          CONSENT_STORAGE_KEY,
          JSON.stringify(consent)
        );
      } catch {
        // A aplicação continua funcionando sem armazenamento local.
      }
    }
  
    return consent;
  }