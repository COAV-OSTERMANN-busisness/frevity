import { describe, expect, it } from "vitest";
import { calculateHandling } from "@/lib/calculation/calculateHandling";

describe("calculateHandling", () => {
  it("returns zero when handling is not required", () => {
    const result = calculateHandling(
      {
        required: false,
      },
      "USD",
    );

    expect(result.amount).toBe(0);
    expect(result.currency).toBe("USD");
  });

  it("sums multiple handling charges", () => {
    const result = calculateHandling(
      {
        required: true,
        charges: [
          {
            type: "loading",
            amount: { amount: 50, currency: "USD" },
          },
          {
            type: "packing",
            amount: { amount: 30, currency: "USD" },
          },
        ],
      },
      "USD",
    );

    expect(result.amount).toBe(80);
    expect(result.currency).toBe("USD");
  });

  it("uses charge amounts as the calculation source", () => {
    const result = calculateHandling(
      {
        required: true,
        charges: [
          {
            type: "loading",
            quantity: 10,
            unitPrice: { amount: 5, currency: "USD" },
            amount: { amount: 42, currency: "USD" },
          },
        ],
      },
      "USD",
    );

    expect(result.amount).toBe(42);
    expect(result.currency).toBe("USD");
  });

  it("returns zero when required handling has no charges", () => {
    const result = calculateHandling(
      {
        required: true,
      },
      "USD",
    );

    expect(result.amount).toBe(0);
    expect(result.currency).toBe("USD");
  });

  it("throws when a handling charge amount uses a different currency", () => {
    expect(() =>
      calculateHandling(
        {
          required: true,
          charges: [
            {
              type: "loading",
              amount: { amount: 50, currency: "EUR" },
            },
          ],
        },
        "USD",
      ),
    ).toThrow("Handling charges must use the calculation currency.");
  });

  it("throws when a handling unit price uses a different currency", () => {
    expect(() =>
      calculateHandling(
        {
          required: true,
          charges: [
            {
              type: "loading",
              unitPrice: { amount: 5, currency: "EUR" },
            },
          ],
        },
        "USD",
      ),
    ).toThrow("Handling unit prices must use the calculation currency.");
  });
});
