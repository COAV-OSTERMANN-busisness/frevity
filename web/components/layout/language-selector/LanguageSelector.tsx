
"use client";

import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { useI18n } from "@/components/providers/i18n";
import { useAnalytics } from "@/components/analytics";

export interface LanguageSelectorProps {
  className?: string;
}

async function recordLanguageChange(): Promise<void> {
  try {
    const response = await fetch("/api/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event: "language_changed" }),
      cache: "no-store",
      keepalive: true,
    });

    if (!response.ok) {
      console.warn(
        "Operational language-change metric was not recorded:",
        response.status
      );
    }
  } catch {
    console.warn("Operational metrics service is unavailable.");
  }
}

export function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const { locale, setLocale } = useI18n();
  const { track } = useAnalytics();

  return (
    <label className={`flex items-center gap-2 ${className}`}>
      <span className="sr-only">Language</span>

      <select
        value={locale}
        onChange={(event) => {
          const nextLocale = event.target.value as typeof locale;

          if (nextLocale === locale) {
            return;
          }

          setLocale(nextLocale);

          track("language_changed", {
            locale: nextLocale,
            previous_locale: locale,
          });

          void recordLanguageChange();
        }}
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        aria-label="Language"
      >
        {SUPPORTED_LOCALES.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {LOCALE_LABELS[supportedLocale]}
          </option>
        ))}
      </select>
    </label>
  );
}
