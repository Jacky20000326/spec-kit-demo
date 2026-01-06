/**
 * Bazi Types - Data structures for Bazi chart calculation and representation
 */

export interface BirthProfile {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  savedAt?: string;
}

export interface Pillar {
  heavenlyStem: string; // 天干: 甲乙丙丁...
  earthlyBranch: string; // 地支: 子丑寅卯...
  element?: string; // 五行: 木火土金水
  tenGod?: string; // 十神
}

export interface FiveElementsDistribution {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  dominant?: string;
  deficient?: string;
}

export interface TenGodsConfig {
  [key: string]: number;
}

export interface BaziChart {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
  fiveElements: FiveElementsDistribution;
  tenGods: TenGodsConfig;
  rawData?: unknown;
  calculatedAt?: string;
}

export interface BaziCalculationRequest {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
}

export interface BaziCalculationResponse {
  success: boolean;
  data?: BaziChart;
  error?: {
    code: string;
    message: string;
    field?: string;
  };
  accuracyWarning?: {
    message: string;
    dateRange: {
      min: number;
      max: number;
    };
    userDate: number;
  };
}
