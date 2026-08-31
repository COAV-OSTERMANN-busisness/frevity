"use client";

import { useI18n } from "@/components/providers/i18n";
import { Hero } from "./hero";

export function HomeContent() {
  const { locale } = useI18n();

  return (
    <div aria-labelledby="landing-title" className="flex flex-1 flex-col">
      <Hero locale={locale} />

      {/* sections a partir daqui */}
    </div>
  );
}
