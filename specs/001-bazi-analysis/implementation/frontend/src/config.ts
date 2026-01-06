/**
 * Application Configuration
 * API 金鑰由使用者在 UI 中提供，不硬編碼
 */

export const CHATGPT_CONFIG = {
  MODEL: 'gpt-3.5-turbo',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000,
};

export const ACCURACY_RANGE = {
  MIN_YEAR: 1900,
  MAX_YEAR: 2100,
};

export const STORAGE_KEYS = {
  SAVED_PROFILE: 'bazi_saved_profile',
  API_KEY: 'bazi_api_key', // Stored in context, not localStorage for security
};

export const API_ENDPOINTS = {
  // Frontend-only application, no backend endpoints
};

export const APP_LIMITS = {
  MIN_YEAR: 1900,
  MAX_YEAR: 2100,
  MAX_ANALYSIS_RETRIES: 0, // No auto-retry for API calls per Constitution
};
