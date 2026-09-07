import type { Freight, Money } from "@/types/calculation";

export function calculateFreight(freight: Freight): Money {
  if (!freight.amount) {
    throw new Error("Freight amount is required.");
  }

  const baseCurrency = freight.amount.currency;

  const additionalCharges = freight.additionalCharges ?? [];

  for (const charge of additionalCharges) {
    if (charge.currency !== baseCurrency) {
      throw new Error("All freight values must use the same currency.");
    }
  }

  if (
    freight.minimumCharge &&
    freight.minimumCharge.currency !== baseCurrency
  ) {
    throw new Error("All freight values must use the same currency.");
  }

  const additionalAmount = additionalCharges.reduce(
    (total, charge) => total + charge.amount,
    0,
  );

  const calculatedAmount = freight.amount.amount + additionalAmount;

  const minimumAmount = freight.minimumCharge?.amount ?? 0;

  return {
    amount: Math.max(calculatedAmount, minimumAmount),
    currency: baseCurrency,
  };
}
