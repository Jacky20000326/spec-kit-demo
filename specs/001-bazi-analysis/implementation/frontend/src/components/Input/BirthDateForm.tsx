/**
 * User Story 1: Birth Date Form Component
 * Captures user birth date and time with validation
 */

import { useState } from 'react';
import { BirthProfile } from '@/types/bazi.types';
import { validateBirthDate, isDateWithinAccuracyRange } from '@/utils/validation';
import { UI_MESSAGES } from '@/constants/messages';

interface BirthDateFormProps {
  onSubmit: (profile: BirthProfile) => void;
  isLoading?: boolean;
}

export function BirthDateForm({ onSubmit, isLoading = false }: BirthDateFormProps) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [accuracyWarning, setAccuracyWarning] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAccuracyWarning(null);

    // Check required fields
    if (!year || !month || !day) {
      setError(UI_MESSAGES.ERR_MISSING_FIELDS);
      return;
    }

    const birthProfile: BirthProfile = {
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      day: parseInt(day, 10),
      hour: hour ? parseInt(hour, 10) : undefined,
      minute: minute ? parseInt(minute, 10) : undefined,
    };

    // Validate
    const validation = validateBirthDate(birthProfile);
    if (!validation.valid) {
      setError(validation.error?.message || UI_MESSAGES.ERR_CALCULATION_FAILED);
      return;
    }

    // Check accuracy range
    if (!isDateWithinAccuracyRange(birthProfile.year)) {
      setAccuracyWarning(UI_MESSAGES.ACCURACY_WARNING);
    }

    onSubmit(birthProfile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">
        {UI_MESSAGES.BIRTH_INFO}
      </h2>

      {/* Date Fields */}
      <div className="grid grid-cols-3 gap-4">
        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {UI_MESSAGES.BIRTH_YEAR}
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={UI_MESSAGES.YEAR_PLACEHOLDER}
            min="1900"
            max="2100"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
            disabled={isLoading}
          />
        </div>

        {/* Month */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {UI_MESSAGES.BIRTH_MONTH}
          </label>
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder={UI_MESSAGES.MONTH_PLACEHOLDER}
            min="1"
            max="12"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
            disabled={isLoading}
          />
        </div>

        {/* Day */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {UI_MESSAGES.BIRTH_DAY}
          </label>
          <input
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder={UI_MESSAGES.DAY_PLACEHOLDER}
            min="1"
            max="31"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Time Fields (Optional) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Hour */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {UI_MESSAGES.BIRTH_HOUR}
          </label>
          <input
            type="number"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            placeholder={UI_MESSAGES.HOUR_PLACEHOLDER}
            min="0"
            max="23"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">可選</p>
        </div>

        {/* Minute */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            分鐘
          </label>
          <input
            type="number"
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            placeholder={UI_MESSAGES.MINUTE_PLACEHOLDER}
            min="0"
            max="59"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-amber-500 focus:ring-amber-500"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">可選</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p className="font-medium">{UI_MESSAGES.ERROR}</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Accuracy Warning */}
      {accuracyWarning && (
        <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
          <p className="text-sm">{accuracyWarning}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-amber-500 px-6 py-3 text-white font-medium hover:bg-amber-600 disabled:bg-gray-400 transition"
      >
        {isLoading ? UI_MESSAGES.PROCESSING : UI_MESSAGES.NEXT}
      </button>
    </form>
  );
}
