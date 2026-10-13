import "server-only";

import type {
  MetricIncrement,
  OperationalMetricName,
} from "@/types/metrics";

const OPERATIONAL_METRICS = [
  "landing_view",
  "calculator_open",
  "calculation_completed",
] as const satisfies readonly OperationalMetricName[];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isOperationalMetricName(
  value: unknown
): value is OperationalMetricName {
  return (
    typeof value === "string" &&
    OPERATIONAL_METRICS.some((metric) => metric === value)
  );
}

export function isValidMetricDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function validateMetricIncrement(
  value: unknown
): MetricIncrement {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    throw new Error("Invalid metric increment payload.");
  }

  const input = value as Record<string, unknown>;

  if (
    Object.keys(input).length !== 2 ||
    !isOperationalMetricName(input.event) ||
    !isValidMetricDate(input.date)
  ) {
    throw new Error("Invalid metric increment payload.");
  }

  return {
    event: input.event,
    date: input.date,
  };
}