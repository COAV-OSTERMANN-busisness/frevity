import type { CurrencyCode, LocalTransport, Money } from "@/types/calculation";

export function calculateLocalTransport(
  localTransport: LocalTransport,
  currency: CurrencyCode,
): Money {
  if (!localTransport.required) {
    return {
      amount: 0,
      currency,
    };
  }

  const charges = localTransport.charges ?? [];

  for (const charge of charges) {
    if (charge.amount && charge.amount.currency !== currency) {
      throw new Error(
        "Local transport charges must use the calculation currency.",
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
