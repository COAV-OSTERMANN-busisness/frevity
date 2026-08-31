import { translate } from "@/lib/i18n/translate";
import type { Locale } from "@/types/i18n/types";

interface HeroProps {
  locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  return (
    <section
      aria-labelledby="landing-title"
      className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
        <span className="mb-6 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-primary)]">
          {translate(locale, "landing.hero.badge")}
        </span>

        <h1
          id="landing-title"
          className="max-w-4xl text-4xl font-bold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl"
        >
          {translate(locale, "landing.hero.title")}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
          {translate(locale, "landing.hero.description")}
        </p>
      </div>
    </section>
  );
}
