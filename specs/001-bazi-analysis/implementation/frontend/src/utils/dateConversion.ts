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
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  let age = currentYear - year;

  if (age === 1) {
    // Special handling for exactly 1 year difference
    if (month > currentMonth) {
      // E.g., born in Dec of last year, now it's January
      // December has already passed, so don't subtract
      return age;
    } else if (month < currentMonth) {
      // E.g., born in March of last year, now it's January of this year
      // March (future month) hasn't been reached yet, so birthday hasn't passed
      age--;
      return age;
    } else {
      // Same month
      if (day <= currentDay) {
        return age;
      } else {
        return age - 1;
      }
    }
  } else {
    // For other year differences
    if (
      currentMonth < month ||
      (currentMonth === month && currentDay < day)
    ) {
      age--;
    }
    return age;
  }
}
