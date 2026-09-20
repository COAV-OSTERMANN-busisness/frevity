"use client";

import { FormEvent, useState } from "react";

import { useI18n } from "@/components/providers/i18n";
import { messages } from "@/lib/i18n/messages";

import type { AdditionalFreightCharge } from "@/types/calculation/freight/additionalFreightCharge";
import type { FreightTransportMode } from "@/types/calculation/freight/freightCalculationInput";
import type { MaritimeFreightType } from "@/types/calculation/freight/maritimeFreight";
import type { FreightTariffBasis } from "@/types/calculation/freight/freightTariff";

import { AdditionalFreightField } from "./AdditionalFreightField";
import { AdditionalFreightFieldForm } from "./AdditionalFreightFieldForm";

const DEFAULT_ESTIMATED_TARIFF_RATE = "39.28";

interface FreightCalculatorFormData {
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

interface FreightCalculatorFormProps {
  onSubmit: (data: FreightCalculatorFormData) => void;
}

export function FreightCalculatorForm({
  onSubmit,
}: FreightCalculatorFormProps) {
  const { locale } = useI18n();
  const translations = messages[locale].calculator.freight;

  const [originCountry, setOriginCountry] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");

  const [mode, setMode] =
    useState<FreightTransportMode>("road");

  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");

  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [tariffBasis, setTariffBasis] =
    useState<FreightTariffBasis>("weight");

  const [tariffRate, setTariffRate] = useState(
    DEFAULT_ESTIMATED_TARIFF_RATE,
  );

  const [volumetricDivisor, setVolumetricDivisor] =
    useState("");

  const [maritimeType, setMaritimeType] =
    useState<MaritimeFreightType>("lcl");

  const [containerQuantity, setContainerQuantity] =
    useState("1");

  const [additionalCharges, setAdditionalCharges] =
    useState<AdditionalFreightCharge[]>([]);

  function addAdditionalCharge(label: string): void {
    setAdditionalCharges((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        label,
        amount: {
          amount: 0,
          currency: "USD",
        },
      },
    ]);
  }

  function updateAdditionalCharge(
    id: string,
    amount: number,
  ): void {
    setAdditionalCharges((current) =>
      current.map((charge) =>
        charge.id === id
          ? {
              ...charge,
              amount: {
                ...charge.amount,
                amount,
              },
            }
          : charge,
      ),
    );
  }

  function removeAdditionalCharge(id: string): void {
    setAdditionalCharges((current) =>
      current.filter((charge) => charge.id !== id),
    );
  }

  function handleModeChange(
    nextMode: FreightTransportMode,
  ): void {
    setMode(nextMode);

    if (nextMode === "air") {
      setTariffBasis("chargeableWeight");
      return;
    }

    if (nextMode === "maritime") {
      setTariffBasis(
        maritimeType === "fcl" ? "unit" : "volume",
      );
      return;
    }

    setTariffBasis("weight");
  }

  function handleMaritimeTypeChange(
    nextType: MaritimeFreightType,
  ): void {
    setMaritimeType(nextType);
    setTariffBasis(
      nextType === "fcl" ? "unit" : "volume",
    );
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    onSubmit({
      originCountry,
      destinationCountry,
      mode,
      quantity: Number(quantity),
      weight: Number(weight),
      length: Number(length),
      width: Number(width),
      height: Number(height),
      tariffBasis,
      tariffRate: Number(tariffRate),
      additionalCharges,
      ...(mode === "air"
        ? {
            volumetricDivisor: Number(
              volumetricDivisor,
            ),
          }
        : {}),
      ...(mode === "maritime"
        ? {
            maritimeType,
            ...(maritimeType === "fcl"
              ? {
                  containerQuantity: Number(
                    containerQuantity,
                  ),
                }
              : {}),
          }
        : {}),
    });
  }

  const inputClassName =
    "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8"
    >
      <div className="border-b border-[var(--color-border)] pb-6">
        <h2
          className="font-bold"
          style={{
            color: "var(--color-text)",
            fontSize: "2.25rem",
            lineHeight: "2.5rem",
          }}
        >
          {translations.title}
        </h2>

        <p
          className="mt-2 max-w-2xl text-sm leading-6 sm:text-base"
          style={{ color: "var(--color-muted)" }}
        >
          {translations.description}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <label className="block">
          <span
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            {translations.fields.origin}
          </span>

          <input
            required
            type="text"
            value={originCountry}
            onChange={(event) =>
              setOriginCountry(event.target.value)
            }
            className={inputClassName}
            style={{ color: "var(--color-text)" }}
          />
        </label>

        <label className="block">
          <span
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            {translations.fields.destination}
          </span>

          <input
            required
            type="text"
            value={destinationCountry}
            onChange={(event) =>
              setDestinationCountry(event.target.value)
            }
            className={inputClassName}
            style={{ color: "var(--color-text)" }}
          />
        </label>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {translations.fields.mode}
            </span>

            <select
              value={mode}
              onChange={(event) =>
                handleModeChange(
                  event.target.value as FreightTransportMode,
                )
              }
              className={inputClassName}
              style={{ color: "var(--color-text)" }}
            >
              <option value="road">
                {translations.modes.road}
              </option>
              <option value="air">
                {translations.modes.air}
              </option>
              <option value="maritime">
                {translations.modes.maritime}
              </option>
            </select>
          </label>

          <label className="block">
            <span
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {translations.fields.quantity}
            </span>

            <input
              required
              min="1"
              step="1"
              type="number"
              value={quantity}
              onChange={(event) =>
                setQuantity(event.target.value)
              }
              className={inputClassName}
              style={{ color: "var(--color-text)" }}
            />
          </label>
        </div>

        {mode === "maritime" && (
          <div className="grid gap-6 md:grid-cols-2">
            <label className="block">
              <span
                className="mb-2 block text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {translations.fields.maritimeType}
              </span>

              <select
                value={maritimeType}
                onChange={(event) =>
                  handleMaritimeTypeChange(
                    event.target.value as MaritimeFreightType,
                  )
                }
                className={inputClassName}
                style={{ color: "var(--color-text)" }}
              >
                <option value="fcl">
                  {translations.maritimeTypes.fcl}
                </option>
                <option value="lcl">
                  {translations.maritimeTypes.lcl}
                </option>
              </select>
            </label>

            {maritimeType === "fcl" && (
              <label className="block">
                <span
                  className="mb-2 block text-sm font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {translations.fields.containerQuantity}
                </span>

                <input
                  required
                  min="1"
                  step="1"
                  type="number"
                  value={containerQuantity}
                  onChange={(event) =>
                    setContainerQuantity(event.target.value)
                  }
                  className={inputClassName}
                  style={{ color: "var(--color-text)" }}
                />
              </label>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {translations.fields.weight}
            </span>

            <input
              required
              min="0"
              step="any"
              type="number"
              value={weight}
              onChange={(event) =>
                setWeight(event.target.value)
              }
              className={inputClassName}
              style={{ color: "var(--color-text)" }}
            />
          </label>

          <label className="block">
            <span
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {translations.fields.tariffBasis}
            </span>

            <select
              value={tariffBasis}
              onChange={(event) =>
                setTariffBasis(
                  event.target.value as FreightTariffBasis,
                )
              }
              className={inputClassName}
              style={{ color: "var(--color-text)" }}
            >
              <option value="weight">
                {translations.tariffBasis.weight}
              </option>
              <option value="volume">
                {translations.tariffBasis.volume}
              </option>
              <option value="chargeableWeight">
                {translations.tariffBasis.chargeableWeight}
              </option>
              <option value="unit">
                {translations.tariffBasis.unit}
              </option>
              <option value="flat">
                {translations.tariffBasis.flat}
              </option>
            </select>
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <label className="block">
            <span
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {translations.fields.length}
            </span>

            <input
              required
              min="0"
              step="any"
              type="number"
              value={length}
              onChange={(event) =>
                setLength(event.target.value)
              }
              className={inputClassName}
              style={{ color: "var(--color-text)" }}
            />
          </label>

          <label className="block">
            <span
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {translations.fields.width}
            </span>

            <input
              required
              min="0"
              step="any"
              type="number"
              value={width}
              onChange={(event) =>
                setWidth(event.target.value)
              }
              className={inputClassName}
              style={{ color: "var(--color-text)" }}
            />
          </label>

          <label className="block">
            <span
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {translations.fields.height}
            </span>

            <input
              required
              min="0"
              step="any"
              type="number"
              value={height}
              onChange={(event) =>
                setHeight(event.target.value)
              }
              className={inputClassName}
              style={{ color: "var(--color-text)" }}
            />
          </label>
        </div>

        {mode === "air" && (
          <label className="block">
            <span
              className="mb-2 block text-sm font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {translations.fields.volumetricDivisor}
            </span>

            <input
              required
              min="0.000001"
              step="any"
              type="number"
              value={volumetricDivisor}
              onChange={(event) =>
                setVolumetricDivisor(event.target.value)
              }
              className={inputClassName}
              style={{ color: "var(--color-text)" }}
            />
          </label>
        )}

        <label className="block">
          <span
            className="mb-2 block text-sm font-medium"
            style={{ color: "var(--color-text)" }}
          >
            {translations.fields.tariffRate}
          </span>

          <input
            required
            min="0"
            step="0.01"
            type="number"
            value={tariffRate}
            onChange={(event) =>
              setTariffRate(event.target.value)
            }
            className={inputClassName}
            style={{ color: "var(--color-text)" }}
          />

          <span
            className="mt-2 block text-xs leading-5"
            style={{ color: "var(--color-muted)" }}
          >
            {translations.fields.tariffEstimate}
          </span>
        </label>

        <div className="border-t border-[var(--color-border)] pt-6">
          <AdditionalFreightFieldForm
            fieldLabel={translations.additional.fieldLabel}
            fieldPlaceholder={translations.additional.placeholder}
            addLabel={translations.additional.add}
            onAdd={addAdditionalCharge}
          />

          {additionalCharges.length > 0 && (
            <div className="mt-6 space-y-4">
              {additionalCharges.map((charge) => (
                <AdditionalFreightField
                  key={charge.id}
                  charge={charge}
                  valueLabel={translations.additional.value}
                  removeLabel={translations.additional.remove}
                  onAmountChange={updateAdditionalCharge}
                  onRemove={removeAdditionalCharge}
                />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[var(--color-border)] pt-6">
          <button
            type="submit"
            className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold transition sm:w-auto sm:min-w-48"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "#ffffff",
            }}
          >
            {translations.submit}
          </button>
        </div>
      </div>
    </form>
  );
}