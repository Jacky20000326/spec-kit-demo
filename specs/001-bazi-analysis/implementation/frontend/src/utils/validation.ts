/**
 * Input Validation Utilities
 */

import { BaziCalculationRequest } from '@/types/bazi.types';
import { UI_MESSAGES, ERROR_CODES } from '@/constants/messages';

interface ValidationResult {
  valid: boolean;
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}

export function validateYear(year: number): ValidationResult {
  if (!Number.isInteger(year)) {
    return {
      valid: false,
      error: {
        code: ERROR_CODES.ERR_YEAR_OUT_OF_RANGE,
        message: UI_MESSAGES.ERR_INVALID_YEAR,
        field: 'year',
      },
    };
  }

  if (year < 1900 || year > 2100) {
    return {
      valid: false,
      error: {
        code: ERROR_CODES.ERR_YEAR_OUT_OF_RANGE,
        message: UI_MESSAGES.ERR_INVALID_YEAR,
        field: 'year',
      },
    };
  }

  return { valid: true };
}

export function validateMonth(month: number): ValidationResult {
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return {
      valid: false,
      error: {
        code: ERROR_CODES.ERR_INVALID_MONTH,
        message: UI_MESSAGES.ERR_INVALID_MONTH,
        field: 'month',
      },
    };
  }

  return { valid: true };
}

export function validateDay(
  day: number,
  month: number,
  year: number
): ValidationResult {
  if (!Number.isInteger(day) || day < 1) {
    return {
      valid: false,
      error: {
        code: ERROR_CODES.ERR_INVALID_DAY,
        message: UI_MESSAGES.ERR_INVALID_DAY,
        field: 'day',
      },
    };
  }

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check leap year
  if (month === 2) {
    const isLeapYear =
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (day > (isLeapYear ? 29 : 28)) {
      return {
        valid: false,
        error: {
          code: ERROR_CODES.ERR_INVALID_DAY,
          message: UI_MESSAGES.ERR_INVALID_DAY,
          field: 'day',
        },
      };
    }
  } else if (day > daysInMonth[month - 1]) {
    return {
      valid: false,
      error: {
        code: ERROR_CODES.ERR_INVALID_DAY,
        message: UI_MESSAGES.ERR_INVALID_DAY,
        field: 'day',
      },
    };
  }

  return { valid: true };
}

export function validateHour(hour: number | undefined): ValidationResult {
  if (hour === undefined || hour === null) {
    return { valid: true }; // Optional field
  }

  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return {
      valid: false,
      error: {
        code: ERROR_CODES.ERR_INVALID_HOUR,
        message: UI_MESSAGES.ERR_INVALID_HOUR,
        field: 'hour',
      },
    };
  }

  return { valid: true };
}

export function validateMinute(minute: number | undefined): ValidationResult {
  if (minute === undefined || minute === null) {
    return { valid: true }; // Optional field
  }

  if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
    return {
      valid: false,
      error: {
        code: ERROR_CODES.ERR_INVALID_MINUTE,
        message: UI_MESSAGES.ERR_INVALID_MINUTE,
        field: 'minute',
      },
    };
  }

  return { valid: true };
}

export function validateBirthDate(request: BaziCalculationRequest): ValidationResult {
  // Validate year
  const yearValidation = validateYear(request.year);
  if (!yearValidation.valid) {
    return yearValidation;
  }

  // Validate month
  const monthValidation = validateMonth(request.month);
  if (!monthValidation.valid) {
    return monthValidation;
  }

  // Validate day
  const dayValidation = validateDay(request.day, request.month, request.year);
  if (!dayValidation.valid) {
    return dayValidation;
  }

  // Validate hour if provided
  const hourValidation = validateHour(request.hour);
  if (!hourValidation.valid) {
    return hourValidation;
  }

  // Validate minute if provided
  const minuteValidation = validateMinute(request.minute);
  if (!minuteValidation.valid) {
    return minuteValidation;
  }

  // Check if date is not in the future
  const today = new Date();
  const birthDate = new Date(request.year, request.month - 1, request.day);

  if (birthDate > today) {
    return {
      valid: false,
      error: {
        code: ERROR_CODES.ERR_FUTURE_DATE,
        message: UI_MESSAGES.ERR_FUTURE_DATE,
        field: 'date',
      },
    };
  }

  return { valid: true };
}

export function isDateWithinAccuracyRange(year: number): boolean {
  return year >= 1900 && year <= 2100;
}
