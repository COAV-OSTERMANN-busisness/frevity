"use client";

import { messages } from "@/lib/i18n/messages";
import { useI18n } from "@/components/providers/i18n";
import type { AdvertisingProps } from "@/types/advertising/Advertising.types";

export function Advertising({
  provider,
  format,
  slot,
  campaignId,
  className = "",
}: AdvertisingProps) {
  const { locale } = useI18n();
  const translations = messages[locale].calculator.advertising;

  return (
    <section
      aria-label={translations.label}
      data-provider={provider}
      data-format={format}
      data-slot={slot}
      data-campaign-id={campaignId}
      className={`w-full ${className}`}
    >
      <div className="mx-auto flex min-h-24 w-full max-w-7xl items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <span className="text-sm" style={{ color: "var(--color-muted)" }}>
          {translations.label}
        </span>
      </div>
    </section>
  );
}
