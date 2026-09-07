import { describe, expect, it } from "vitest";
import { calculateRealityScore } from "@/lib/calculation/calculateRealityScore";

describe("calculateRealityScore", () => {
  it("returns HIGH when all MVP factors are valid", () => {
    const result = calculateRealityScore({
      logisticsPercentage: 20,
      totalWeight: { value: 100, unit: "kg" },
      cargoValue: { amount: 1000, currency: "USD" },
    });

    expect(result).toBe("HIGH");
  });

  it("returns MEDIUM when two MVP factors are valid", () => {
    const result = calculateRealityScore({
      logisticsPercentage: 20,
      totalWeight: { value: 100, unit: "kg" },
      cargoValue: { amount: 0, currency: "BRL" },
    });

    expect(result).toBe("MEDIUM");
  });

  it("returns LOW when only one MVP factor is valid", () => {
    const result = calculateRealityScore({
      logisticsPercentage: 20,
      totalWeight: { value: 0, unit: "kg" },
      cargoValue: { amount: 0, currency: "EUR" },
    });

    expect(result).toBe("LOW");
  });

  it("returns LOW when all MVP factors are zero", () => {
    const result = calculateRealityScore({
      logisticsPercentage: 0,
      totalWeight: { value: 0, unit: "kg" },
      cargoValue: { amount: 0, currency: "JPY" },
    });

    expect(result).toBe("LOW");
  });

  it("throws when logistics percentage is negative", () => {
    expect(() =>
      calculateRealityScore({
        logisticsPercentage: -1,
        totalWeight: { value: 100, unit: "kg" },
        cargoValue: { amount: 1000, currency: "USD" },
      }),
    ).toThrow("Logistics percentage must be zero or greater.");
  });

  it("throws when logistics percentage is not finite", () => {
    expect(() =>
      calculateRealityScore({
        logisticsPercentage: Number.NaN,
        totalWeight: { value: 100, unit: "kg" },
        cargoValue: { amount: 1000, currency: "USD" },
      }),
    ).toThrow("Logistics percentage must be a finite number.");
  });

  it("throws when weight is negative", () => {
    expect(() =>
      calculateRealityScore({
        logisticsPercentage: 20,
        totalWeight: { value: -1, unit: "kg" },
        cargoValue: { amount: 1000, currency: "USD" },
      }),
    ).toThrow("Total weight must be zero or greater.");
  });

  it("throws when cargo value is negative", () => {
    expect(() =>
      calculateRealityScore({
        logisticsPercentage: 20,
        totalWeight: { value: 100, unit: "kg" },
        cargoValue: { amount: -1, currency: "USD" },
      }),
    ).toThrow("Cargo value must be zero or greater.");
  });
});
