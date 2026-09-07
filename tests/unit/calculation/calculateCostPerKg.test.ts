import { describe, expect, it } from "vitest";
import { calculateCostPerKg } from "@/lib/calculation/calculateCostPerKg";

describe("calculateCostPerKg", () => {
  it("calculates cost per kilogram when weight is already in kilograms", () => {
    const result = calculateCostPerKg(
      { amount: 100, currency: "USD" },
      { value: 10, unit: "kg" },
    );

    expect(result.amount).toBe(10);
    expect(result.currency).toBe("USD");
  });

  it("converts grams to kilograms", () => {
    const result = calculateCostPerKg(
      { amount: 100, currency: "USD" },
      { value: 5000, unit: "g" },
    );

    expect(result.amount).toBe(20);
    expect(result.currency).toBe("USD");
  });

  it("converts pounds to kilograms", () => {
    const result = calculateCostPerKg(
      { amount: 100, currency: "USD" },
      { value: 10, unit: "lb" },
    );

    expect(result.amount).toBeCloseTo(22.04622622, 8);
    expect(result.currency).toBe("USD");
  });

  it("throws when total weight is zero", () => {
    expect(() =>
      calculateCostPerKg(
        { amount: 100, currency: "USD" },
        { value: 0, unit: "kg" },
      ),
    ).toThrow("Total weight must be greater than zero.");
  });

  it("throws when total weight is negative", () => {
    expect(() =>
      calculateCostPerKg(
        { amount: 100, currency: "USD" },
        { value: -5, unit: "kg" },
      ),
    ).toThrow("Total weight must be greater than zero.");
  });

  it("preserves the calculation currency", () => {
    const result = calculateCostPerKg(
      { amount: 150, currency: "EUR" },
      { value: 5, unit: "kg" },
    );

    expect(result.amount).toBe(30);
    expect(result.currency).toBe("EUR");
  });
});
