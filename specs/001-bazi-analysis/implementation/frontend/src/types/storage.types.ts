/**
 * Storage Types - LocalStorage persistence structures
 */

import { BirthProfile, BaziChart } from './bazi.types';
import { AnalysisResult } from './analysis.types';

export interface SavedProfile {
  profile: BirthProfile;
  chart: BaziChart;
  analysis: AnalysisResult;
  savedAt: string;
  version: string;
}

export interface SaveRequest {
  profile: BirthProfile;
  chart: BaziChart;
  analysis: AnalysisResult;
}

export interface SaveResponse {
  success: boolean;
  message: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface LoadResponse {
  success: boolean;
  data?: SavedProfile;
  error?: {
    code: string;
    message: string;
  };
}

export interface ClearResponse {
  success: boolean;
  message: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface StorageError {
  code: string;
  message: string;
}
