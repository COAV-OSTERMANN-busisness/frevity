"use client";

import { useI18n } from "@/components/providers/i18n";
import { Hero } from "./hero";
import { HowItWorks } from "./how-it-works";

export function HomeContent() {
  const { locale } = useI18n();

  return (
    <div aria-labelledby="landing-title" className="flex flex-1 flex-col">
      <Hero locale={locale} />

      <HowItWorks locale={locale} />
    </div>
  );
}
