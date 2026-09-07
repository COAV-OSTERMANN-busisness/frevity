import { describe, expect, it } from "vitest";
import { calculateCostPerUnit } from "@/lib/calculation/calculateCostPerUnit";

describe("calculateCostPerUnit", () => {
  it("calculates cost per unit", () => {
    const result = calculateCostPerUnit({ amount: 100, currency: "USD" }, 10);

    expect(result.amount).toBe(10);
    expect(result.currency).toBe("USD");
  });

  it("returns a decimal result when the total cost is not evenly divisible", () => {
    const result = calculateCostPerUnit({ amount: 100, currency: "USD" }, 3);

    expect(result.amount).toBeCloseTo(33.3333333333, 10);
    expect(result.currency).toBe("USD");
  });

  it("throws when quantity is zero", () => {
    expect(() =>
      calculateCostPerUnit({ amount: 100, currency: "USD" }, 0),
    ).toThrow("Quantity must be greater than zero.");
  });

  it("throws when quantity is negative", () => {
    expect(() =>
      calculateCostPerUnit({ amount: 100, currency: "USD" }, -5),
    ).toThrow("Quantity must be greater than zero.");
  });
});
