"use client";

import { useState } from "react";

import { messages } from "@/lib/i18n/messages";

import { useI18n } from "@/components/providers/i18n";

import type { CalculationResult } from "@/types/calculation/landedCost/calculationResult";
import type { FreightResult } from "@/types/calculation/freight/freightResult";

import { CalculatorForm } from "./landed/CalculatorForm";

import { FreightCalculatorForm } from "./freight";

import { CalculatorSwitcher, type CalculatorType } from "./CalculatorSwitcher";

import { CalculatorResult } from "./CalculatorResult";

interface CalculatorWorkspaceProps {
  landedCostResult?: CalculationResult;
  freightResult?: FreightResult;
}

export function CalculatorWorkspace({
  landedCostResult,
  freightResult,
}: CalculatorWorkspaceProps) {
  const { locale } = useI18n();

  const [activeCalculator, setActiveCalculator] =
    useState<CalculatorType>("freight");

  const calculatorTranslations = messages[locale].calculator;

  return (
    <>
      <section
        aria-label="Calculator selector"
        className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 pt-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-5xl">
          <CalculatorSwitcher
            activeCalculator={activeCalculator}
            onChange={setActiveCalculator}
            freightLabel={calculatorTranslations.freight.title}
            landedCostLabel={calculatorTranslations.form.title}
          />
        </div>
      </section>

      <section
        aria-label="Calculator"
        className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-5xl">
          {activeCalculator === "freight" ? (
            <FreightCalculatorForm
              onSubmit={() => {
                /*
                 * FreightCalculationInput integration
                 * will be connected in the next step.
                 */
              }}
            />
          ) : (
            <CalculatorForm />
          )}
        </div>
      </section>

      {activeCalculator === "freight" && freightResult && (
        <section
          aria-label="Freight simulation result"
          className="bg-[var(--color-surface)] px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-5xl">
            <CalculatorResult result={freightResult} />
          </div>
        </section>
      )}

      {activeCalculator === "landedCost" && landedCostResult && (
        <section
          aria-label="Simulation result"
          className="bg-[var(--color-surface)] px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-5xl">
            <CalculatorResult result={landedCostResult} />
          </div>
        </section>
      )}
    </>
  );
}
