import { describe, expect, it } from "vitest";
import { calculateInsurance } from "@/lib/calculation/calculateInsurance";

describe("calculateInsurance", () => {
  it("returns zero when insurance is disabled", () => {
    const result = calculateInsurance(
      {
        enabled: false,
      },
      "USD",
    );

    expect(result.amount).toBe(0);
    expect(result.currency).toBe("USD");
  });

  it("calculates insurance from the insured value and rate", () => {
    const result = calculateInsurance(
      {
        enabled: true,
        insuredValue: { amount: 1000, currency: "USD" },
        ratePercent: 2.5,
      },
      "USD",
    );

    expect(result.amount).toBe(25);
    expect(result.currency).toBe("USD");
  });

  it("returns zero when the insurance rate is zero", () => {
    const result = calculateInsurance(
      {
        enabled: true,
        insuredValue: { amount: 1000, currency: "USD" },
        ratePercent: 0,
      },
      "USD",
    );

    expect(result.amount).toBe(0);
    expect(result.currency).toBe("USD");
  });

  it("throws when insurance is enabled without an insured value", () => {
    expect(() =>
      calculateInsurance(
        {
          enabled: true,
          ratePercent: 2,
        },
        "USD",
      ),
    ).toThrow("Insured value is required when insurance is enabled.");
  });

  it("throws when the insurance rate is negative", () => {
    expect(() =>
      calculateInsurance(
        {
          enabled: true,
          insuredValue: { amount: 1000, currency: "USD" },
          ratePercent: -1,
        },
        "USD",
      ),
    ).toThrow("Insurance rate must be zero or greater.");
  });

  it("throws when the insured value uses a different currency", () => {
    expect(() =>
      calculateInsurance(
        {
          enabled: true,
          insuredValue: { amount: 1000, currency: "EUR" },
          ratePercent: 2,
        },
        "USD",
      ),
    ).toThrow("Insured value must use the calculation currency.");
  });
});
