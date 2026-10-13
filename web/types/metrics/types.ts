export type OperationalMetricName =
  | "landing_view"
  | "calculator_open"
  | "calculation_completed";

export interface MetricCounter {
  event: OperationalMetricName;
  date: string;
  count: number;
  updatedAt: Date;
}

export interface MetricIncrement {
  event: OperationalMetricName;
  date: string;
}

export interface MetricsRepository {
  increment(input: MetricIncrement): Promise<void>;

  getCounter(
    event: OperationalMetricName,
    date: string
  ): Promise<MetricCounter | null>;
}