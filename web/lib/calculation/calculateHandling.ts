import type { CurrencyCode, Handling, Money } from "@/types/calculation";

export function calculateHandling(
  handling: Handling,
  currency: CurrencyCode,
): Money {
  if (!handling.required) {
    return {
      amount: 0,
      currency,
    };
  }

  const charges = handling.charges ?? [];

  for (const charge of charges) {
    if (charge.amount && charge.amount.currency !== currency) {
      throw new Error("Handling charges must use the calculation currency.");
    }

    if (charge.unitPrice && charge.unitPrice.currency !== currency) {
      throw new Error(
        "Handling unit prices must use the calculation currency.",
      );
    }
  }

  const amount = charges.reduce(
    (total, charge) => total + (charge.amount?.amount ?? 0),
    0,
  );

  return {
    amount,
    currency,
  };
}
