import type { Money } from "@/types/calculation/cargo";

export interface LandedCostInput {
  freight: Money;
  insurance?: Money;
  customs?: Money;
  handling?: Money;
  localTransport?: Money;
  otherCosts?: Money;
}

/**
 * Ensures that all monetary values participating in the
 * landed cost calculation use the same currency.
 *
 * Currency resolution is handled outside the calculation engine.
 * The engine receives already-resolved monetary values.
 */
function assertSameCurrency(
  base: Money,
  values: Array<Money | undefined>,
): void {
  for (const value of values) {
    if (value && value.currency !== base.currency) {
      throw new Error("All monetary values must use the same currency.");
    }
  }
}

/**
 * Calculates the total landed cost from the freight and
 * applicable logistics cost components.
 *
 * The calculation engine does not determine the currency
 * from country, locale, or transport scope.
 *
 * National and international currency rules must be resolved
 * before this function is called:
 *
 * - Supported national markets → configured national currency
 * - International freight in the MVP → USD
 */
export function calculateLandedCost(input: LandedCostInput): Money {
  const { freight, insurance, customs, handling, localTransport, otherCosts } =
    input;

  assertSameCurrency(freight, [
    insurance,
    customs,
    handling,
    localTransport,
    otherCosts,
  ]);

  const amount =
    freight.amount +
    (insurance?.amount ?? 0) +
    (customs?.amount ?? 0) +
    (handling?.amount ?? 0) +
    (localTransport?.amount ?? 0) +
    (otherCosts?.amount ?? 0);

  return {
    amount,
    currency: freight.currency,
  };
}
