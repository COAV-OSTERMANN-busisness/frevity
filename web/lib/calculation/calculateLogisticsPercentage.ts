import type { Money } from "@/types/calculation";

export function calculateLogisticsPercentage(
  logisticsCost: Money,
  cargoValue: Money,
): number {
  if (cargoValue.amount <= 0) {
    throw new Error("Cargo value must be greater than zero.");
  }

  if (logisticsCost.currency !== cargoValue.currency) {
    throw new Error(
      "Logistics cost and cargo value must use the same currency.",
    );
  }

  return (logisticsCost.amount / cargoValue.amount) * 100;
}
