/**
 * Bazi Calculation Service
 * Wrapper around the 'bazi' npm package
 */

import {
  BaziCalculationRequest,
  BaziCalculationResponse,
  BaziChart,
  Pillar,
} from '@/types/bazi.types';
import { validateBirthDate, isDateWithinAccuracyRange } from '@/utils/validation';
import { UI_MESSAGES, ERROR_CODES } from '@/constants/messages';

// Mock Bazi library for now (would be: import { calculateBazi } from 'bazi')
// In production, replace this with actual library
type BaziLibraryOutput = {
  yearPillar: { stem: string; branch: string };
  monthPillar: { stem: string; branch: string };
  dayPillar: { stem: string; branch: string };
  hourPillar?: { stem: string; branch: string };
  fiveElements: Record<string, number>;
  tenGods: Record<string, number>;
};

// Mock function - would be actual Bazi library call
function mockCalculateBazi(request: BaziCalculationRequest): BaziLibraryOutput {
  return {
    yearPillar: { stem: '庚', branch: '午' },
    monthPillar: { stem: '己', branch: '巳' },
    dayPillar: { stem: '甲', branch: '子' },
    hourPillar: request.hour
      ? { stem: '丙', branch: '寅' }
      : undefined,
    fiveElements: { wood: 2, fire: 3, earth: 0, metal: 2, water: 1 },
    tenGods: {
      bijiJie: 1,
      jieYin: 0,
      shishi: 2,
      shang: 1,
      ge: 1,
      zhengguan: 1,
      pianlu: 0,
      zhengcai: 1,
      piancai: 0,
      yinxiao: 1,
    },
  };
}

export class BaziCalculationService {
  calculate(request: BaziCalculationRequest): BaziCalculationResponse {
    try {
      // 1. Validate input
      const validation = validateBirthDate(request);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
          data: null,
        };
      }

      // 2. Check accuracy range
      const isInAccuracyRange = isDateWithinAccuracyRange(request.year);
      const accuracyWarning = !isInAccuracyRange
        ? {
            message: UI_MESSAGES.ACCURACY_WARNING,
            dateRange: { min: 1900, max: 2100 },
            userDate: request.year,
          }
        : undefined;

      // 3. Call Bazi library
      const baziData = mockCalculateBazi(request);

      // 4. Convert to our format
      const chart: BaziChart = {
        yearPillar: this.mapPillar(
          baziData.yearPillar.stem,
          baziData.yearPillar.branch
        ),
        monthPillar: this.mapPillar(
          baziData.monthPillar.stem,
          baziData.monthPillar.branch
        ),
        dayPillar: this.mapPillar(
          baziData.dayPillar.stem,
          baziData.dayPillar.branch
        ),
        hourPillar: baziData.hourPillar
          ? this.mapPillar(
              baziData.hourPillar.stem,
              baziData.hourPillar.branch
            )
          : null,
        fiveElements: {
          wood: baziData.fiveElements.wood || 0,
          fire: baziData.fiveElements.fire || 0,
          earth: baziData.fiveElements.earth || 0,
          metal: baziData.fiveElements.metal || 0,
          water: baziData.fiveElements.water || 0,
          dominant: this.getDominantElement(baziData.fiveElements),
          deficient: this.getDeficientElement(baziData.fiveElements),
        },
        tenGods: baziData.tenGods,
        rawData: baziData,
        calculatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: chart,
        accuracyWarning,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: ERROR_CODES.ERR_CALCULATION_FAILED,
          message: UI_MESSAGES.ERR_CALCULATION_FAILED,
        },
        data: null,
      };
    }
  }

  private mapPillar(stem: string, branch: string): Pillar {
    return {
      heavenlyStem: stem,
      earthlyBranch: branch,
      element: this.getElementForStem(stem),
    };
  }

  private getElementForStem(stem: string): string {
    const elementMap: Record<string, string> = {
      甲: '木',
      乙: '木',
      丙: '火',
      丁: '火',
      戊: '土',
      己: '土',
      庚: '金',
      辛: '金',
      壬: '水',
      癸: '水',
    };
    return elementMap[stem] || '未知';
  }

  private getDominantElement(
    elements: Record<string, number>
  ): string {
    let max = 0;
    let dominant = '';
    for (const [element, count] of Object.entries(elements)) {
      if (count > max) {
        max = count;
        dominant = element;
      }
    }
    return dominant;
  }

  private getDeficientElement(
    elements: Record<string, number>
  ): string {
    let min = Infinity;
    let deficient = '';
    for (const [element, count] of Object.entries(elements)) {
      if (count < min) {
        min = count;
        deficient = element;
      }
    }
    return deficient;
  }
}
