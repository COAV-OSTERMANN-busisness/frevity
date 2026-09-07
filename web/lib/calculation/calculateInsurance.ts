import type { CurrencyCode, Insurance, Money } from "@/types/calculation";

export function calculateInsurance(
  insurance: Insurance,
  currency: CurrencyCode,
): Money {
  if (!insurance.enabled) {
    return {
      amount: 0,
      currency,
    };
  }

  if (!insurance.insuredValue) {
    throw new Error("Insured value is required when insurance is enabled.");
  }

  if (insurance.insuredValue.currency !== currency) {
    throw new Error("Insured value must use the calculation currency.");
  }

  if (insurance.ratePercent === undefined || insurance.ratePercent < 0) {
    throw new Error("Insurance rate must be zero or greater.");
  }

  const amount = insurance.insuredValue.amount * (insurance.ratePercent / 100);

  return {
    amount,
    currency,
  };
}
