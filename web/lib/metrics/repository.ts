import "server-only";

import type { MetricsRepository } from "@/types/metrics";

import { firestoreMetricsRepository } from "./firestore";

export const metricsRepository: MetricsRepository =
  firestoreMetricsRepository;