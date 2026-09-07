import { describe, expect, it } from "vitest";
import { calculateLandedCost } from "@/lib/calculation/calculateLandedCost";

describe("calculateLandedCost", () => {
  it("returns freight as the landed cost when no optional costs are provided", () => {
    const result = calculateLandedCost({
      freight: { amount: 100, currency: "USD" },
    });

    expect(result.amount).toBe(100);
    expect(result.currency).toBe("USD");
  });

  it("sums all landed cost components", () => {
    const result = calculateLandedCost({
      freight: { amount: 100, currency: "USD" },
      insurance: { amount: 10, currency: "USD" },
      customs: { amount: 20, currency: "USD" },
      handling: { amount: 15, currency: "USD" },
      localTransport: { amount: 25, currency: "USD" },
      otherCosts: { amount: 30, currency: "USD" },
    });

    expect(result.amount).toBe(200);
    expect(result.currency).toBe("USD");
  });

  it("treats omitted optional costs as zero", () => {
    const result = calculateLandedCost({
      freight: { amount: 100, currency: "USD" },
      insurance: undefined,
      customs: undefined,
      handling: undefined,
      localTransport: undefined,
      otherCosts: undefined,
    });

    expect(result.amount).toBe(100);
    expect(result.currency).toBe("USD");
  });

  it("accepts zero optional costs", () => {
    const result = calculateLandedCost({
      freight: { amount: 100, currency: "USD" },
      insurance: { amount: 0, currency: "USD" },
      customs: { amount: 0, currency: "USD" },
      handling: { amount: 0, currency: "USD" },
      localTransport: { amount: 0, currency: "USD" },
      otherCosts: { amount: 0, currency: "USD" },
    });

    expect(result.amount).toBe(100);
    expect(result.currency).toBe("USD");
  });

  it("throws when an optional monetary value uses a different currency", () => {
    expect(() =>
      calculateLandedCost({
        freight: { amount: 100, currency: "USD" },
        customs: { amount: 20, currency: "EUR" },
      }),
    ).toThrow("All monetary values must use the same currency.");
  });
});
