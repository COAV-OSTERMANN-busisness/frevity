import { describe, expect, it } from "vitest";
import { calculateLogisticsPercentage } from "@/lib/calculation/calculateLogisticsPercentage";

const currencies = ["BRL", "EUR", "USD", "JPY"];

describe("calculateLogisticsPercentage", () => {
  it.each(currencies)(
    "calculates the logistics percentage using %s",
    (currency) => {
      const result = calculateLogisticsPercentage(
        { amount: 200, currency },
        { amount: 1000, currency },
      );

      expect(result).toBe(20);
    },
  );

  it("returns zero when logistics cost is zero", () => {
    const result = calculateLogisticsPercentage(
      { amount: 0, currency: "BRL" },
      { amount: 1000, currency: "BRL" },
    );

    expect(result).toBe(0);
  });

  it("throws when cargo value is zero", () => {
    expect(() =>
      calculateLogisticsPercentage(
        { amount: 200, currency: "EUR" },
        { amount: 0, currency: "EUR" },
      ),
    ).toThrow("Cargo value must be greater than zero.");
  });

  it("throws when cargo value is negative", () => {
    expect(() =>
      calculateLogisticsPercentage(
        { amount: 200, currency: "USD" },
        { amount: -1000, currency: "USD" },
      ),
    ).toThrow("Cargo value must be greater than zero.");
  });

  it("throws when logistics cost and cargo value use different currencies", () => {
    expect(() =>
      calculateLogisticsPercentage(
        { amount: 200, currency: "BRL" },
        { amount: 1000, currency: "JPY" },
      ),
    ).toThrow("Logistics cost and cargo value must use the same currency.");
  });
});
