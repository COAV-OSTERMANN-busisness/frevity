export type AdvertisingProvider = "google" | "frevity" | "custom";

export type AdvertisingFormat =
  | "banner"
  | "rectangle"
  | "native"
  | "responsive";

export interface AdvertisingProps {
  provider: AdvertisingProvider;
  format: AdvertisingFormat;
  slot?: string;
  campaignId?: string;
  className?: string;
}
