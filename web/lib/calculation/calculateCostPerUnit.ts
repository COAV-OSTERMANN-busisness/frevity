import type { Money } from "@/types/calculation";

export function calculateCostPerUnit(
  totalCost: Money,
  quantity: number
): Money {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  return {
    amount: totalCost.amount / quantity,
    currency: totalCost.currency,
  };
}
