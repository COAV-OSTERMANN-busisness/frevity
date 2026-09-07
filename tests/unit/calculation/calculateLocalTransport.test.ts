import { describe, expect, it } from "vitest";
import { calculateCostPerKg } from "@/lib/calculation/calculateCostPerKg";

const currencies = ["BRL", "EUR", "USD", "JPY"];

describe("calculateCostPerKg", () => {
  it.each(currencies)("calculates cost per kilogram using %s", (currency) => {
    const result = calculateCostPerKg(
      { amount: 100, currency },
      { value: 10, unit: "kg" },
    );

    expect(result.amount).toBe(10);
    expect(result.currency).toBe(currency);
  });

  it("converts grams to kilograms", () => {
    const result = calculateCostPerKg(
      { amount: 100, currency: "BRL" },
      { value: 5000, unit: "g" },
    );

    expect(result.amount).toBe(20);
    expect(result.currency).toBe("BRL");
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
        { amount: 100, currency: "EUR" },
        { value: 0, unit: "kg" },
      ),
    ).toThrow("Total weight must be greater than zero.");
  });

  it("throws when total weight is negative", () => {
    expect(() =>
      calculateCostPerKg(
        { amount: 100, currency: "JPY" },
        { value: -5, unit: "kg" },
      ),
    ).toThrow("Total weight must be greater than zero.");
  });
});
