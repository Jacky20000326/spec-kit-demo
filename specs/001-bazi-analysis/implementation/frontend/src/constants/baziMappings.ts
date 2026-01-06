/**
 * Bazi Mappings
 * Heavenly Stems, Earthly Branches, Five Elements, and Ten Gods mappings
 */

// Heavenly Stems (天干)
export const HEAVENLY_STEMS = {
  甲: { element: '木', yin: false, name: '甲' },
  乙: { element: '木', yin: true, name: '乙' },
  丙: { element: '火', yin: false, name: '丙' },
  丁: { element: '火', yin: true, name: '丁' },
  戊: { element: '土', yin: false, name: '戊' },
  己: { element: '土', yin: true, name: '己' },
  庚: { element: '金', yin: false, name: '庚' },
  辛: { element: '金', yin: true, name: '辛' },
  壬: { element: '水', yin: false, name: '壬' },
  癸: { element: '水', yin: true, name: '癸' },
};

// Earthly Branches (地支)
export const EARTHLY_BRANCHES = {
  子: { element: '水', animal: '鼠', month: 11 },
  丑: { element: '土', animal: '牛', month: 12 },
  寅: { element: '木', animal: '虎', month: 1 },
  卯: { element: '木', animal: '兔', month: 2 },
  辰: { element: '土', animal: '龍', month: 3 },
  巳: { element: '火', animal: '蛇', month: 4 },
  午: { element: '火', animal: '馬', month: 5 },
  未: { element: '土', animal: '羊', month: 6 },
  申: { element: '金', animal: '猴', month: 7 },
  酉: { element: '金', animal: '雞', month: 8 },
  戌: { element: '土', animal: '狗', month: 9 },
  亥: { element: '水', animal: '豬', month: 10 },
};

// Five Elements (五行)
export const FIVE_ELEMENTS = {
  木: { name: '木', color: '綠', direction: '東', season: '春', emotion: '怒' },
  火: { name: '火', color: '紅', direction: '南', season: '夏', emotion: '喜' },
  土: { name: '土', color: '黃', direction: '中', season: '四季', emotion: '思' },
  金: { name: '金', color: '白', direction: '西', season: '秋', emotion: '悲' },
  水: { name: '水', color: '黑', direction: '北', season: '冬', emotion: '恐' },
};

// Ten Gods (十神)
export const TEN_GODS = {
  比肩: { symbol: '比', meaning: '同類、同心', nature: '陽' },
  劫刃: { symbol: '劫', meaning: '奪取、競爭', nature: '陰' },
  食神: { symbol: '食', meaning: '產出、表達', nature: '陽' },
  傷官: { symbol: '傷', meaning: '技能、創意', nature: '陰' },
  正財: { symbol: '財', meaning: '收入、物質', nature: '陽' },
  偏財: { symbol: '財', meaning: '意外、機遇', nature: '陰' },
  正官: { symbol: '官', meaning: '事業、責任', nature: '陽' },
  七殺: { symbol: '殺', meaning: '權力、挑戰', nature: '陰' },
  正印: { symbol: '印', meaning: '智慧、保護', nature: '陽' },
  偏印: { symbol: '印', meaning: '特殊才能', nature: '陰' },
};

// Element Relationships (相生相剋)
export const ELEMENT_RELATIONS = {
  相生: {
    木: '火',
    火: '土',
    土: '金',
    金: '水',
    水: '木',
  },
  相剋: {
    木: '土',
    土: '水',
    水: '火',
    火: '金',
    金: '木',
  },
};

// Lucky Numbers by Element
export const LUCKY_NUMBERS = {
  木: [3, 8],
  火: [2, 7],
  土: [5, 10],
  金: [4, 9],
  水: [1, 6],
};

// Lucky Colors by Element
export const LUCKY_COLORS = {
  木: ['綠', '青'],
  火: ['紅', '紫'],
  土: ['黃', '褐'],
  金: ['白', '金'],
  水: ['黑', '藍'],
};
