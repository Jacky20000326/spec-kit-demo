/**
 * Date Conversion Utilities
 * Gregorian ↔ Lunar calendar conversion helpers
 */

/**
 * Convert Gregorian date to Lunar date string
 * Note: This is a simplified version. For production, use a dedicated library.
 */
export function gregorianToLunar(year: number, month: number, day: number): string {
  // Placeholder implementation
  // In production, use 'lunar-calendar' or 'bazi' library's conversion methods
  return `農曆 ${month}月 ${day}日`;
}

/**
 * Convert Lunar date to Gregorian date
 */
export function lunarToGregorian(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number
): { year: number; month: number; day: number } {
  // Placeholder implementation
  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
  };
}

/**
 * Check if a Gregorian date falls within the accuracy range for Bazi calculation
 */
export function isDateWithinBaziAccuracyRange(
  year: number,
  month: number,
  day: number
): boolean {
  return year >= 1900 && year <= 2100;
}

/**
 * Format a date for display
 */
export function formatDateForDisplay(
  year: number,
  month: number,
  day: number
): string {
  return `${year}年 ${month}月 ${day}日`;
}

/**
 * Get the age of a person given their birth date
 */
export function calculateAge(
  year: number,
  month: number,
  day: number
): number {
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
