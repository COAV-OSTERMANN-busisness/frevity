import type { CurrencyCode, Customs, Money } from "@/types/calculation";

export function calculateCustoms(
  customs: Customs,
  currency: CurrencyCode,
): Money {
  if (!customs.required) {
    return {
      amount: 0,
      currency,
    };
  }

  const duties = customs.duties;
  const taxes = customs.taxes;

  if (duties && duties.currency !== currency) {
    throw new Error("Customs duties must use the calculation currency.");
  }

  if (taxes && taxes.currency !== currency) {
    throw new Error("Customs taxes must use the calculation currency.");
  }

  return {
    amount: (duties?.amount ?? 0) + (taxes?.amount ?? 0),
    currency,
  };
}
