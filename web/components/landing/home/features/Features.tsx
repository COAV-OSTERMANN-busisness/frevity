import {
  faCalculator,
  faChartLine,
  faGlobe,
  faListCheck,
  faScaleBalanced,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { translate } from "@/lib/i18n/translate";
import type { Locale } from "@/types/i18n/types";

interface FeaturesProps {
  locale: Locale;
}

const features = [
  {
    key: "one",
    icon: faCalculator,
  },
  {
    key: "two",
    icon: faTableList,
  },
  {
    key: "three",
    icon: faGlobe,
  },
  {
    key: "four",
    icon: faChartLine,
  },
  {
    key: "five",
    icon: faScaleBalanced,
  },
  {
    key: "six",
    icon: faListCheck,
  },
] as const;

export function Features({ locale }: FeaturesProps) {
  return (
    <section
      aria-labelledby="features-title"
      className="border-t border-[var(--border)] bg-[var(--background)] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="features-title"
            className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl"
          >
            {translate(locale, "landing.features.title")}
          </h2>

          <p className="mt-4 text-base leading-7 text-[var(--muted)] sm:text-lg">
            {translate(locale, "landing.features.description")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.key}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-primary)]">
                <FontAwesomeIcon
                  icon={feature.icon}
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-[var(--text)]">
                {translate(
                  locale,
                  `landing.features.items.${feature.key}.title`,
                )}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {translate(
                  locale,
                  `landing.features.items.${feature.key}.description`,
                )}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
