/**
 * Traditional Chinese UI Messages
 * 繁體中文 UI 訊息常數
 */

export const UI_MESSAGES = {
  // App Header
  APP_TITLE: '八字命理分析',
  APP_SUBTITLE: '輸入您的出生日期，了解自己的八字命盤',

  // Form Labels
  BIRTH_YEAR: '出生年份',
  BIRTH_MONTH: '出生月份',
  BIRTH_DAY: '出生日期',
  BIRTH_HOUR: '出生時辰 (可選)',
  BIRTH_MINUTE: '分鐘 (可選)',

  // Placeholders
  YEAR_PLACEHOLDER: '例如: 1990',
  MONTH_PLACEHOLDER: '1-12',
  DAY_PLACEHOLDER: '1-31',
  HOUR_PLACEHOLDER: '0-23',
  MINUTE_PLACEHOLDER: '0-59',

  // Buttons
  NEXT: '下一步',
  SUBMIT: '提交',
  SAVE: '保存配置',
  SHARE: '分享分析',
  LOAD: '載入配置',
  CLEAR: '清除',
  CANCEL: '取消',
  CONFIRM: '確認',

  // Status Messages
  LOADING: '載入中...',
  PROCESSING: '處理中...',
  SUCCESS: '成功!',
  ERROR: '發生錯誤',
  CALCULATING: '計算中...',
  GENERATING_ANALYSIS: '生成分析中...',

  // Error Messages
  ERR_INVALID_YEAR: '請輸入有效的年份 (1900-2100)',
  ERR_INVALID_MONTH: '請輸入有效的月份 (1-12)',
  ERR_INVALID_DAY: '請輸入有效的日期',
  ERR_INVALID_HOUR: '請輸入有效的時辰 (0-23)',
  ERR_INVALID_MINUTE: '請輸入有效的分鐘 (0-59)',
  ERR_FUTURE_DATE: '出生日期不能早於今天',
  ERR_MISSING_FIELDS: '請填寫所有必填欄位',
  ERR_CALCULATION_FAILED: '無法計算八字圖表，請稍後重試',
  ERR_API_KEY_MISSING: '請提供 ChatGPT API 金鑰',
  ERR_API_KEY_INVALID: 'ChatGPT API 金鑰無效或已過期',
  ERR_API_QUOTA_EXCEEDED: '您的 ChatGPT API 額度已用盡，請檢查帳戶狀態',
  ERR_NETWORK: '網絡連接錯誤，請檢查您的網絡',
  ERR_STORAGE_QUOTA_EXCEEDED: 'LocalStorage 已滿，無法保存',
  ERR_NO_SAVED_PROFILE: '尚無保存的配置檔案',
  ERR_CORRUPTED_DATA: '保存的配置檔案已損壞',

  // Validation Messages
  REQUIRED_FIELD: '此欄位為必填項',
  ACCURACY_WARNING: '此日期超出保證準確性範圍 (1900–2100)，計算結果為估算精度',

  // Section Titles
  BIRTH_INFO: '出生信息',
  BAZI_CHART: '八字圖表',
  ANALYSIS: '分析結果',
  PERSONALITY: '性格特質',
  CAREER: '事業發展',
  WEALTH: '財運走勢',
  RELATIONSHIP: '感情關係',
  OUTLOOK: '近期運勢',

  // UI Elements
  HEAVENLY_STEM: '天干',
  EARTHLY_BRANCH: '地支',
  ELEMENT: '五行',
  TEN_GOD: '十神',
  FIVE_ELEMENTS: '五行分佈',
  WOOD: '木',
  FIRE: '火',
  EARTH: '土',
  METAL: '金',
  WATER: '水',

  // Notifications
  SAVED_SUCCESSFULLY: '配置已成功保存',
  COPIED_TO_CLIPBOARD: '已複製到剪貼板',
  PROFILE_LOADED: '配置已載入',
  PROFILE_CLEARED: '配置已清除',

  // API Key Setup
  API_KEY_PROMPT: '請輸入您的 OpenAI API 金鑰',
  API_KEY_PLACEHOLDER: 'sk-...',
  API_KEY_SAVED: 'API 金鑰已保存',
  API_KEY_REMOVED: 'API 金鑰已移除',
};

export const RULES_MESSAGES = {
  // Rule explanations
  FIRE_DOMINANT: '火元素偏強',
  WOOD_STRENGTH: '木元素有力',
  WATER_WEAKNESS: '水元素缺乏',
};

export const ERROR_CODES = {
  ERR_YEAR_OUT_OF_RANGE: 'ERR_YEAR_OUT_OF_RANGE',
  ERR_INVALID_MONTH: 'ERR_INVALID_MONTH',
  ERR_INVALID_DAY: 'ERR_INVALID_DAY',
  ERR_INVALID_HOUR: 'ERR_INVALID_HOUR',
  ERR_INVALID_MINUTE: 'ERR_INVALID_MINUTE',
  ERR_FUTURE_DATE: 'ERR_FUTURE_DATE',
  ERR_CALCULATION_FAILED: 'ERR_CALCULATION_FAILED',
  ERR_INVALID_API_KEY: 'ERR_INVALID_API_KEY',
  ERR_API_QUOTA_EXCEEDED: 'ERR_API_QUOTA_EXCEEDED',
  ERR_STORAGE_QUOTA_EXCEEDED: 'ERR_STORAGE_QUOTA_EXCEEDED',
  ERR_NO_SAVED_PROFILE: 'ERR_NO_SAVED_PROFILE',
  ERR_CORRUPTED_DATA: 'ERR_CORRUPTED_DATA',
};
