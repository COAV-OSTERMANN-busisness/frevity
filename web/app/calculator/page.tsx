import type { Metadata } from "next";

import { Advertising } from "@/components/advertising";
import { CalculatorWorkspace } from "@/components/calculator";
import { mockCalculationResult } from "@/mocks/calculation";

export const metadata: Metadata = {
  title: "Freight Cost Calculator & Shipping Cost Estimator",
  description:
    "Estimate freight and shipping costs for road, air, and maritime shipments with the Frevity freight cost calculator.",
  alternates: {
    canonical: "/calculator",
  },
  openGraph: {
    type: "website",
    url: "/calculator",
    title: "Freight Cost Calculator & Shipping Cost Estimator | Frevity",
    description:
      "Estimate freight and shipping costs for road, air, and maritime shipments with Frevity.",
  },
  twitter: {
    card: "summary",
    title: "Freight Cost Calculator & Shipping Cost Estimator | Frevity",
    description:
      "Estimate freight and shipping costs for road, air, and maritime shipments with Frevity.",
  },
};

export default function CalculatorPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section
        aria-label="Advertising"
        className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-8 sm:px-6 lg:px-8"
      >
        <div
          className="mx-auto flex min-h-32 w-full max-w-7xl items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]"
          style={{ marginTop: "3rem" }}
        >
          <Advertising
            provider="google"
            format="banner"
          />
        </div>
      </section>

      <CalculatorWorkspace
        landedCostResult={mockCalculationResult}
      />
    </div>
  );
}