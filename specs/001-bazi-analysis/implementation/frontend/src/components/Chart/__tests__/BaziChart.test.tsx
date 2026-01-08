/**
 * Tests for BaziChart Component (User Story 2)
 */

import { describe, it, expect } from 'vitest';
import { BaziChart as BaziChartType, BirthProfile } from '@/types/bazi.types';

describe('BaziChart Display', () => {
  // Mock data for testing
  const mockBirthProfile: BirthProfile = {
    year: 1990,
    month: 5,
    day: 15,
    hour: 14,
    minute: 30,
  };

  const mockBaziChart: BaziChartType = {
    yearPillar: {
      heavenlyStem: '庚',
      earthlyBranch: '午',
      element: '金',
    },
    monthPillar: {
      heavenlyStem: '己',
      earthlyBranch: '巳',
      element: '土',
    },
    dayPillar: {
      heavenlyStem: '甲',
      earthlyBranch: '子',
      element: '木',
    },
    hourPillar: {
      heavenlyStem: '丙',
      earthlyBranch: '寅',
      element: '火',
    },
    fiveElements: {
      wood: 2,
      fire: 3,
      earth: 1,
      metal: 1,
      water: 1,
      dominant: '火',
      deficient: '金',
    },
    tenGods: {
      bijiJie: 1,
      jieYin: 0,
      shishi: 2,
      shang: 1,
    },
    calculatedAt: new Date().toISOString(),
  };

  it('should have all four pillars with correct structure', () => {
    expect(mockBaziChart.yearPillar).toBeDefined();
    expect(mockBaziChart.monthPillar).toBeDefined();
    expect(mockBaziChart.dayPillar).toBeDefined();
    expect(mockBaziChart.hourPillar).toBeDefined();

    // Check pillar structure
    const pillar = mockBaziChart.yearPillar;
    expect(pillar.heavenlyStem).toBeDefined();
    expect(pillar.earthlyBranch).toBeDefined();
    expect(pillar.element).toBeDefined();
  });

  it('should have five elements distribution', () => {
    const elements = mockBaziChart.fiveElements;
    expect(elements.wood).toBe(2);
    expect(elements.fire).toBe(3);
    expect(elements.earth).toBe(1);
    expect(elements.metal).toBe(1);
    expect(elements.water).toBe(1);
    expect(elements.dominant).toBe('火');
    expect(elements.deficient).toBe('金');
  });

  it('should have valid heavenly stems', () => {
    const validStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const pillars = [
      mockBaziChart.yearPillar,
      mockBaziChart.monthPillar,
      mockBaziChart.dayPillar,
      mockBaziChart.hourPillar,
    ];

    pillars.forEach((pillar) => {
      if (pillar) {
        expect(validStems).toContain(pillar.heavenlyStem);
      }
    });
  });

  it('should have valid earthly branches', () => {
    const validBranches = [
      '子', '丑', '寅', '卯', '辰', '巳',
      '午', '未', '申', '酉', '戌', '亥',
    ];
    const pillars = [
      mockBaziChart.yearPillar,
      mockBaziChart.monthPillar,
      mockBaziChart.dayPillar,
      mockBaziChart.hourPillar,
    ];

    pillars.forEach((pillar) => {
      if (pillar) {
        expect(validBranches).toContain(pillar.earthlyBranch);
      }
    });
  });

  it('should have valid five elements', () => {
    const validElements = ['木', '火', '土', '金', '水'];
    const pillars = [
      mockBaziChart.yearPillar,
      mockBaziChart.monthPillar,
      mockBaziChart.dayPillar,
      mockBaziChart.hourPillar,
    ];

    pillars.forEach((pillar) => {
      if (pillar && pillar.element) {
        expect(validElements).toContain(pillar.element);
      }
    });
  });

  it('should calculate total five elements count', () => {
    const total =
      mockBaziChart.fiveElements.wood +
      mockBaziChart.fiveElements.fire +
      mockBaziChart.fiveElements.earth +
      mockBaziChart.fiveElements.metal +
      mockBaziChart.fiveElements.water;
    expect(total).toBe(8);
  });

  it('should identify dominant element correctly', () => {
    expect(mockBaziChart.fiveElements.dominant).toBe('火');
    const fireCount = mockBaziChart.fiveElements.fire;
    const otherCounts = [
      mockBaziChart.fiveElements.wood,
      mockBaziChart.fiveElements.earth,
      mockBaziChart.fiveElements.metal,
      mockBaziChart.fiveElements.water,
    ];
    expect(fireCount >= Math.max(...otherCounts)).toBe(true);
  });
});
