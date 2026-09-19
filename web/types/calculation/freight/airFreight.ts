import type { FreightMoney, FreightTariff } from "./freightTariff";

export interface AirFreightInput {
  actualWeight: number;
  volumetricWeight: number;
  tariff: FreightTariff;
}

export interface AirFreightResult {
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  baseFreight: FreightMoney;
}
