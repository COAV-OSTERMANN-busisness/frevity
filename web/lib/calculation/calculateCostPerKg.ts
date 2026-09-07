import type { Money, Weight } from "@/types/calculation";

export function calculateCostPerKg(
  totalCost: Money,
  totalWeight: Weight
): Money {
  if (totalWeight.value <= 0) {
    throw new Error("Total weight must be greater than zero.");
  }

  const weightInKg = convertToKg(totalWeight);

  if (weightInKg <= 0) {
    throw new Error("Total weight must be greater than zero.");
  }

  return {
    amount: totalCost.amount / weightInKg,
    currency: totalCost.currency,
  };
}

function convertToKg(weight: Weight): number {
  switch (weight.unit) {
    case "g":
      return weight.value / 1000;

    case "kg":
      return weight.value;

    case "lb":
      return weight.value * 0.45359237;

    default:
      return assertNever(weight.unit);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported weight unit: ${String(value)}`);
}
