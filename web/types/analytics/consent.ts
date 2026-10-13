export type AnalyticsConsentStatus =
  | "pending"
  | "granted"
  | "denied";

export interface PrivacyConsent {
  essential: true;
  analytics: AnalyticsConsentStatus;
  updatedAt: string | null;
}

export interface ConsentContextValue {
  consent: PrivacyConsent;
  acceptAll: () => void;
  acceptEssentialOnly: () => void;
  revokeAnalytics: () => void;
}