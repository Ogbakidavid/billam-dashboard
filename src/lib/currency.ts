/**
 * Shared currency formatting utility for BillAm.
 * All monetary values in the data model are numeric (NGN).
 * Format only at render time using these helpers.
 */

/**
 * Format a numeric NGN amount for display.
 * @example formatNGN(1926650) → "₦1,926,650"
 */
export function formatNGN(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

/**
 * Parse a formatted NGN string back to a number.
 * @example parseNGN("₦1,926,650") → 1926650
 */
export function parseNGN(formatted: string): number {
  return Number(formatted.replace(/[₦,\s]/g, '')) || 0;
}

/**
 * Format a timestamp string for display.
 * Accepts ISO 8601 strings and returns "HH:MM AM/PM".
 */
export function formatTime(timestamp: string | undefined | null): string {
  if (!timestamp) return '';
  try {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timestamp;
  }
}
