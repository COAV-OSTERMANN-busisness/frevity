import type {
    RoadFreightInput,
    RoadFreightResult,
  } from "@/types/calculation/freight/roadFreight";
  
  function assertPositiveFinite(
    value: number,
    field: string,
  ): void {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(
        `${field} must be a finite number greater than zero.`,
      );
    }
  }
  
  export function calculateRoadFreight(
    input: RoadFreightInput,
  ): RoadFreightResult {
    const { tariff } = input;
  
    assertPositiveFinite(
      tariff.rate.amount,
      "Tariff rate",
    );
  
    let tariffQuantity: number;
  
    switch (tariff.basis) {
      case "weight":
        assertPositiveFinite(
          input.actualWeight,
          "Actual weight",
        );
  
        tariffQuantity = input.actualWeight;
        break;
  
      case "volume":
        assertPositiveFinite(
          input.volume,
          "Volume",
        );
  
        tariffQuantity = input.volume;
        break;
  
      case "unit":
        assertPositiveFinite(
          input.quantity,
          "Quantity",
        );
  
        tariffQuantity = input.quantity;
        break;
  
      case "flat":
        tariffQuantity = 1;
        break;
  
      case "chargeableWeight":
        throw new Error(
          "Chargeable weight tariff basis is not supported by the current road freight input.",
        );
  
      default: {
        const exhaustiveCheck: never = tariff.basis;
        throw new Error(
          `Unsupported road freight tariff basis: ${exhaustiveCheck}`,
        );
      }
    }
  
    let amount = tariff.rate.amount * tariffQuantity;
  
    if (!Number.isFinite(amount)) {
      throw new Error(
        "Calculated road freight must be finite.",
      );
    }
  
    if (tariff.minimumCharge) {
      if (
        tariff.minimumCharge.currency !==
        tariff.rate.currency
      ) {
        throw new Error(
          "Minimum charge currency must match tariff currency.",
        );
      }
  
      assertPositiveFinite(
        tariff.minimumCharge.amount,
        "Minimum charge",
      );
  
      amount = Math.max(
        amount,
        tariff.minimumCharge.amount,
      );
    }
  
    return {
      baseFreight: {
        amount,
        currency: tariff.rate.currency,
      },
    };
  }