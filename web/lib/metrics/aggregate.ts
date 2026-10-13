import "server-only";

import { metricsRepository } from "./repository";
import { validateMetricIncrement } from "./validation";

import type {
  MetricCounter,
  OperationalMetricName,
} from "@/types/metrics";

function getCurrentUtcDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function recordOperationalMetric(
  event: OperationalMetricName
): Promise<void> {
  const input = validateMetricIncrement({
    event,
    date: getCurrentUtcDate(),
  });

  await metricsRepository.increment(input);
}

export async function getOperationalMetric(
  event: OperationalMetricName,
  date: string
): Promise<MetricCounter | null> {
  const input = validateMetricIncrement({ event, date });

  return metricsRepository.getCounter(input.event, input.date);
}