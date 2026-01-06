/**
 * Test Data Fixtures
 * Valid and invalid birth profiles for testing validation
 */

import { BaziCalculationRequest } from '@/types/bazi.types';

// Valid birth profiles
export const validProfiles: BaziCalculationRequest[] = [
  { year: 1990, month: 5, day: 15, hour: 14, minute: 30 },
  { year: 1985, month: 1, day: 20 },
  { year: 2000, month: 12, day: 25 },
  { year: 1900, month: 1, day: 1 },
  { year: 2100, month: 12, day: 31 },
];

// Invalid profiles - date errors
export const invalidProfiles = {
  invalidYear: [
    { year: 1899, month: 5, day: 15 }, // Too early
    { year: 2101, month: 5, day: 15 }, // Too late
    { year: -1000, month: 5, day: 15 }, // Negative
  ],
  invalidMonth: [
    { year: 1990, month: 0, day: 15 },
    { year: 1990, month: 13, day: 15 },
  ],
  invalidDay: [
    { year: 1990, month: 2, day: 30 }, // February 30
    { year: 1990, month: 4, day: 31 }, // April 31
    { year: 1990, month: 1, day: 0 },
  ],
  invalidHour: [
    { year: 1990, month: 5, day: 15, hour: -1 },
    { year: 1990, month: 5, day: 15, hour: 24 },
  ],
  invalidMinute: [
    { year: 1990, month: 5, day: 15, minute: -1 },
    { year: 1990, month: 5, day: 15, minute: 60 },
  ],
};

// Edge cases
export const edgeCases = {
  leapYear: [
    { year: 2000, month: 2, day: 29 }, // Valid leap year
    { year: 1900, month: 2, day: 29 }, // Invalid (not a leap year)
    { year: 2004, month: 2, day: 29 }, // Valid leap year
  ],
  monthBoundaries: [
    { year: 1990, month: 1, day: 31 }, // January
    { year: 1990, month: 4, day: 30 }, // April
    { year: 1990, month: 12, day: 31 }, // December
  ],
  timeBoundaries: [
    { year: 1990, month: 5, day: 15, hour: 0, minute: 0 }, // Midnight
    { year: 1990, month: 5, day: 15, hour: 23, minute: 59 }, // Just before midnight
  ],
};
