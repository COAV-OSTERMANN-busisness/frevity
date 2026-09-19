import type {
    AirFreightInput,
    AirFreightResult,
  } from "@/types/calculation/freight/airFreight";
  
  import { calculateChargeableWeight } from "../common/calculateChargeableWeight";
  
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
  
  export function calculateAirFreight(
    input: AirFreightInput,
  ): AirFreightResult {
    const { tariff } = input;
  
    assertPositiveFinite(
      tariff.rate.amount,
      "Tariff rate",
    );
  
    const { chargeableWeight } =
      calculateChargeableWeight({
        actualWeight: input.actualWeight,
        volumetricWeight: input.volumetricWeight,
      });
  
    let tariffQuantity: number;
  
    switch (tariff.basis) {
      case "weight":
        tariffQuantity = input.actualWeight;
        break;
  
      case "chargeableWeight":
        tariffQuantity = chargeableWeight;
        break;
  
      case "flat":
        tariffQuantity = 1;
        break;
  
      case "volume":
        throw new Error(
          "Volume tariff basis is not supported by the current air freight input.",
        );
  
      case "unit":
        throw new Error(
          "Unit tariff basis is not supported by the current air freight input.",
        );
  
      default: {
        const exhaustiveCheck: never = tariff.basis;
        throw new Error(
          `Unsupported air freight tariff basis: ${exhaustiveCheck}`,
        );
      }
    }
  
    let amount = tariff.rate.amount * tariffQuantity;
  
    if (!Number.isFinite(amount)) {
      throw new Error(
        "Calculated air freight must be finite.",
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
      actualWeight: input.actualWeight,
      volumetricWeight: input.volumetricWeight,
      chargeableWeight,
      baseFreight: {
        amount,
        currency: tariff.rate.currency,
      },
    };
  }