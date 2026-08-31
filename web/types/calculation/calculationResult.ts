import type { Money } from "./cargo";

/**
 * Breakdown of the calculated logistics costs.
 */
export interface CalculationBreakdown {
  /**
   * Cargo-related cost.
   */
  cargo?: Money;

  /**
   * Main freight cost.
   */
  freight?: Money;

  /**
   * Insurance cost.
   */
  insurance?: Money;

  /**
   * Customs-related costs.
   */
  customs?: Money;

  /**
   * Handling costs.
   */
  handling?: Money;

  /**
   * Local transportation costs.
   */
  localTransport?: Money;

  /**
   * Other additional costs.
   */
  otherCosts?: Money;
}

/**
 * Final calculation result.
 */
export interface CalculationResult {
  /**
   * Currency used for the result.
   */
  currency: string;

  /**
   * Individual cost components.
   */
  breakdown: CalculationBreakdown;

  /**
   * Final calculated amount.
   */
  total: Money;

  /**
   * Optional timestamp indicating when
   * the calculation was performed.
   */
  calculatedAt?: string;

  /**
   * Optional calculation/reference identifier.
   */
  reference?: string;
}