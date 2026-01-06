/**
 * Test Fixtures: Bazi Charts
 * Pre-calculated test charts for independent story testing
 */

import { BaziChart, BirthProfile } from '@/types/bazi.types';

// Test Profile 1: Fire Dominant
export const profile1: BirthProfile = {
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
};

export const chart1: BaziChart = {
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
    earth: 0,
    metal: 2,
    water: 1,
    dominant: '火',
    deficient: '土',
  },
  tenGods: {
    bijiJie: 0,
    jieYin: 1,
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

// Test Profile 2: Water Dominant
export const profile2: BirthProfile = {
  year: 1985,
  month: 1,
  day: 20,
  hour: 8,
  minute: 0,
};

export const chart2: BaziChart = {
  yearPillar: {
    heavenlyStem: '乙',
    earthlyBranch: '丑',
    element: '木',
  },
  monthPillar: {
    heavenlyStem: '丙',
    earthlyBranch: '子',
    element: '火',
  },
  dayPillar: {
    heavenlyStem: '壬',
    earthlyBranch: '子',
    element: '水',
  },
  hourPillar: {
    heavenlyStem: '庚',
    earthlyBranch: '辰',
    element: '金',
  },
  fiveElements: {
    wood: 1,
    fire: 1,
    earth: 0,
    metal: 2,
    water: 4,
    dominant: '水',
    deficient: '土',
  },
  tenGods: {
    bijiJie: 2,
    jieYin: 1,
    shishi: 0,
    shang: 1,
    ge: 1,
    zhengguan: 2,
    pianlu: 1,
    zhengcai: 0,
    piancai: 1,
    yinxiao: 1,
  },
};

// Test Profile 3: Balanced (No Hour)
export const profile3: BirthProfile = {
  year: 1995,
  month: 7,
  day: 10,
};

export const chart3: BaziChart = {
  yearPillar: {
    heavenlyStem: '乙',
    earthlyBranch: '亥',
    element: '木',
  },
  monthPillar: {
    heavenlyStem: '丙',
    earthlyBranch: '未',
    element: '火',
  },
  dayPillar: {
    heavenlyStem: '丁',
    earthlyBranch: '卯',
    element: '火',
  },
  hourPillar: null,
  fiveElements: {
    wood: 2,
    fire: 2,
    earth: 1,
    metal: 0,
    water: 1,
    dominant: '木',
    deficient: '金',
  },
  tenGods: {
    bijiJie: 1,
    jieYin: 0,
    shishi: 1,
    shang: 1,
    ge: 1,
    zhengguan: 1,
    pianlu: 0,
    zhengcai: 1,
    piancai: 1,
    yinxiao: 1,
  },
};

export const allTestCharts = [
  { profile: profile1, chart: chart1, label: 'Fire Dominant' },
  { profile: profile2, chart: chart2, label: 'Water Dominant' },
  { profile: profile3, chart: chart3, label: 'Balanced (No Hour)' },
];
