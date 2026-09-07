import { describe, expect, it } from "vitest";
import { calculateFreight } from "@/lib/calculation/calculateFreight";

describe("calculateFreight", () => {
  it("returns the freight amount when there are no additional charges", () => {
    const result = calculateFreight({
      mode: "air",
      basis: "weight",
      amount: { amount: 100, currency: "USD" },
    });

    expect(result.amount).toBe(100);
    expect(result.currency).toBe("USD");
  });

  it("adds additional charges to the freight amount", () => {
    const result = calculateFreight({
      mode: "air",
      basis: "weight",
      amount: { amount: 100, currency: "USD" },
      additionalCharges: [
        { amount: 25, currency: "USD" },
        { amount: 15, currency: "USD" },
      ],
    });

    expect(result.amount).toBe(140);
    expect(result.currency).toBe("USD");
  });

  it("applies minimum charge when it is greater than the calculated amount", () => {
    const result = calculateFreight({
      mode: "road",
      basis: "weight",
      amount: { amount: 100, currency: "USD" },
      additionalCharges: [{ amount: 20, currency: "USD" }],
      minimumCharge: { amount: 150, currency: "USD" },
    });

    expect(result.amount).toBe(150);
    expect(result.currency).toBe("USD");
  });

  it("keeps the calculated amount when it is greater than minimum charge", () => {
    const result = calculateFreight({
      mode: "maritime",
      basis: "flat",
      amount: { amount: 100, currency: "USD" },
      additionalCharges: [{ amount: 50, currency: "USD" }],
      minimumCharge: { amount: 120, currency: "USD" },
    });

    expect(result.amount).toBe(150);
    expect(result.currency).toBe("USD");
  });

  it("throws when an additional charge uses a different currency", () => {
    expect(() =>
      calculateFreight({
        mode: "air",
        basis: "weight",
        amount: { amount: 100, currency: "USD" },
        additionalCharges: [{ amount: 25, currency: "EUR" }],
      }),
    ).toThrow("All freight values must use the same currency.");
  });

  it("throws when minimum charge uses a different currency", () => {
    expect(() =>
      calculateFreight({
        mode: "road",
        basis: "weight",
        amount: { amount: 100, currency: "USD" },
        minimumCharge: { amount: 150, currency: "EUR" },
      }),
    ).toThrow("All freight values must use the same currency.");
  });

  it("throws when freight amount is missing", () => {
    expect(() =>
      calculateFreight({
        mode: "air",
        basis: "weight",
      }),
    ).toThrow("Freight amount is required.");
  });
});
