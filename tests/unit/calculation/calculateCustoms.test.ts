import { describe, expect, it } from "vitest";
import { calculateCustoms } from "@/lib/calculation/calculateCustoms";

describe("calculateCustoms", () => {
  it("returns zero when customs are not required", () => {
    const result = calculateCustoms(
      {
        required: false,
      },
      "USD",
    );

    expect(result.amount).toBe(0);
    expect(result.currency).toBe("USD");
  });

  it("returns duties when only duties are provided", () => {
    const result = calculateCustoms(
      {
        required: true,
        duties: { amount: 100, currency: "USD" },
      },
      "USD",
    );

    expect(result.amount).toBe(100);
    expect(result.currency).toBe("USD");
  });

  it("returns taxes when only taxes are provided", () => {
    const result = calculateCustoms(
      {
        required: true,
        taxes: { amount: 50, currency: "USD" },
      },
      "USD",
    );

    expect(result.amount).toBe(50);
    expect(result.currency).toBe("USD");
  });

  it("sums duties and taxes", () => {
    const result = calculateCustoms(
      {
        required: true,
        duties: { amount: 100, currency: "USD" },
        taxes: { amount: 50, currency: "USD" },
      },
      "USD",
    );

    expect(result.amount).toBe(150);
    expect(result.currency).toBe("USD");
  });

  it("returns zero when required customs have no duties or taxes", () => {
    const result = calculateCustoms(
      {
        required: true,
      },
      "USD",
    );

    expect(result.amount).toBe(0);
    expect(result.currency).toBe("USD");
  });

  it("throws when duties use a different currency", () => {
    expect(() =>
      calculateCustoms(
        {
          required: true,
          duties: { amount: 100, currency: "EUR" },
        },
        "USD",
      ),
    ).toThrow("Customs duties must use the calculation currency.");
  });

  it("throws when taxes use a different currency", () => {
    expect(() =>
      calculateCustoms(
        {
          required: true,
          taxes: { amount: 50, currency: "EUR" },
        },
        "USD",
      ),
    ).toThrow("Customs taxes must use the calculation currency.");
  });
});
