"use client";

import { useState } from "react";

import { messages } from "@/lib/i18n/messages";
import {
  calculateVolume,
  calculateVolumetricWeight,
  resolveFreightContext,
} from "@/lib/calculation/freight";
import { convertLength } from "@/lib/conversion";

import { useI18n } from "@/components/providers/i18n";

import type { CalculationResult } from "@/types/calculation/landedCost/calculationResult";
import type { FreightResult } from "@/types/calculation/freight/freightResult";
import type {
  FreightCalculationInput,
  FreightTransportMode,
} from "@/types/calculation/freight/freightCalculationInput";
import type { AdditionalFreightCharge } from "@/types/calculation/freight/additionalFreightCharge";
import type { MaritimeFreightType } from "@/types/calculation/freight/maritimeFreight";
import type { FreightTariffBasis } from "@/types/calculation/freight/freightTariff";

import { CalculatorForm } from "./landed/CalculatorForm";
import { FreightCalculatorForm } from "./freight";
import { CalculatorSwitcher, type CalculatorType } from "./CalculatorSwitcher";
import { CalculatorResult } from "./CalculatorResult";

interface CalculatorWorkspaceProps {
  landedCostResult?: CalculationResult;
  freightResult?: FreightResult;
}

interface FreightFormData {
  originCountry: string;
  destinationCountry: string;
  mode: FreightTransportMode;
  quantity: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  tariffBasis: FreightTariffBasis;
  tariffRate: number;
  volumetricDivisor?: number;
  maritimeType?: MaritimeFreightType;
  containerQuantity?: number;
  additionalCharges: AdditionalFreightCharge[];
}

interface GeocodeResponse {
  latitude: number;
  longitude: number;
  countryCode: string;
}

interface RoadDistanceResponse {
  distanceKm: number;
  origin: GeocodeResponse;
  destination: GeocodeResponse;
}

interface ResolvedFreightContext {
  originCountry: string;
  destinationCountry: string;
  scope: FreightCalculationInput["scope"];
  currency: string;
}

function buildFreightCalculationInput(
  data: FreightFormData,
  context: ResolvedFreightContext
): FreightCalculationInput {
  const tariff = {
    basis: data.tariffBasis,
    rate: {
      amount: data.tariffRate,
      currency: context.currency,
    },
  };

  const additionalCharges = data.additionalCharges.map((charge) => ({
    ...charge,
    amount: {
      ...charge.amount,
      currency: context.currency,
    },
  }));

  const route = {
    originCountry: context.originCountry,
    destinationCountry: context.destinationCountry,
  };

  if (data.mode === "road") {
    return {
      scope: context.scope,
      mode: "road",
      route,
      road: {
        actualWeight: data.weight,
        volume: calculateVolume({
          length: data.length,
          width: data.width,
          height: data.height,
        }),
        quantity: data.quantity,
        tariff,
      },
      additionalCharges,
    };
  }

  if (data.mode === "air") {
    if (data.volumetricDivisor === undefined) {
      throw new Error("Air freight volumetric divisor is required.");
    }

    const volumetricWeight = calculateVolumetricWeight({
      length: convertLength(data.length, "m", "cm"),
      width: convertLength(data.width, "m", "cm"),
      height: convertLength(data.height, "m", "cm"),
      divisor: data.volumetricDivisor,
    });

    return {
      scope: context.scope,
      mode: "air",
      route,
      air: {
        actualWeight: data.weight,
        volumetricWeight: volumetricWeight.value,
        tariff,
      },
      additionalCharges,
    };
  }

  if (!data.maritimeType) {
    throw new Error("Maritime freight type is required.");
  }

  if (data.maritimeType === "fcl") {
    if (data.containerQuantity === undefined) {
      throw new Error("FCL container quantity is required.");
    }

    return {
      scope: context.scope,
      mode: "maritime",
      route,
      maritime: {
        type: "fcl",
        fcl: {
          tariff,
          containerQuantity: data.containerQuantity,
        },
      },
      additionalCharges,
    };
  }

  return {
    scope: context.scope,
    mode: "maritime",
    route,
    maritime: {
      type: "lcl",
      lcl: {
        actualWeight: data.weight,
        volume: calculateVolume({
          length: data.length,
          width: data.width,
          height: data.height,
        }),
        tariff,
      },
    },
    additionalCharges,
  };
}

async function geocodeLocation(location: string): Promise<GeocodeResponse> {
  const response = await fetch("/api/geocode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location }),
  });

  if (!response.ok) {
    throw new Error(`Unable to geocode "${location}".`);
  }

  return (await response.json()) as GeocodeResponse;
}

async function resolveCountries(data: FreightFormData): Promise<{
  originCountry: string;
  destinationCountry: string;
  distanceKm?: number;
}> {
  if (data.mode === "road") {
    const response = await fetch("/api/road-distance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: data.originCountry,
        destination: data.destinationCountry,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to calculate road distance.");
    }

    const result = (await response.json()) as RoadDistanceResponse;

    return {
      originCountry: result.origin.countryCode,
      destinationCountry: result.destination.countryCode,
      distanceKm: result.distanceKm,
    };
  }

  const [origin, destination] = await Promise.all([
    geocodeLocation(data.originCountry),
    geocodeLocation(data.destinationCountry),
  ]);

  return {
    originCountry: origin.countryCode,
    destinationCountry: destination.countryCode,
  };
}

export function CalculatorWorkspace({
  landedCostResult,
  freightResult,
}: CalculatorWorkspaceProps) {
  const { locale } = useI18n();

  const [activeCalculator, setActiveCalculator] =
    useState<CalculatorType>("freight");

  const calculatorTranslations = messages[locale].calculator;

  async function handleFreightSubmit(data: FreightFormData): Promise<void> {
    try {
      const locationContext = await resolveCountries(data);

      const freightContext = resolveFreightContext(
        locationContext.originCountry,
        locationContext.destinationCountry
      );

      const freightCalculationInput = buildFreightCalculationInput(data, {
        originCountry: freightContext.originCountry,
        destinationCountry: freightContext.destinationCountry,
        scope: freightContext.scope,
        currency: freightContext.currency,
      });

      console.log("Freight calculation input:", freightCalculationInput);
    } catch (error) {
      console.error("Freight context resolution failed:", error);
    }
  }

  return (
    <>
      <section
        aria-label="Calculator selector"
        className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 pt-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-5xl">
          <CalculatorSwitcher
            activeCalculator={activeCalculator}
            onChange={setActiveCalculator}
            freightLabel={calculatorTranslations.freight.title}
            landedCostLabel={calculatorTranslations.form.title}
          />
        </div>
      </section>

      <section
        aria-label="Calculator"
        className="border-b border-[var(--color-border)] bg-[var(--color-background)] px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto w-full max-w-5xl">
          {activeCalculator === "freight" ? (
            <FreightCalculatorForm onSubmit={handleFreightSubmit} />
          ) : (
            <CalculatorForm />
          )}
        </div>
      </section>

      {activeCalculator === "freight" && freightResult && (
        <section
          aria-label="Freight simulation result"
          className="bg-[var(--color-surface)] px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-5xl">
            <CalculatorResult result={freightResult} />
          </div>
        </section>
      )}

      {activeCalculator === "landedCost" && landedCostResult && (
        <section
          aria-label="Simulation result"
          className="bg-[var(--color-surface)] px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto w-full max-w-5xl">
            <CalculatorResult result={landedCostResult} />
          </div>
        </section>
      )}
    </>
  );
}