# Data Model: Bazi Analysis Web App

**Date**: 2026-01-06
**Phase**: Phase 1 Design

---

## Core Entities

### 1. BirthProfile

**用途**: 儲存用戶輸入的出生日期和時間

```typescript
interface BirthProfile {
  // 必填
  year: number;              // 西曆年份，1900–2100
  month: number;             // 月份，1–12
  day: number;               // 日期，1–31 (驗證後)

  // 選填
  hour?: number;             // 時辰，0–23
  minute?: number;           // 分鐘，0–59

  // 系統
  savedAt?: Date;            // 儲存時間戳
  id?: string;               // 唯一識別符（LocalStorage key）
}
```

**驗證規則**:
- 年份: `1900 ≤ year ≤ 2100`
- 月份: `1 ≤ month ≤ 12`
- 日期: 根據月份驗證（含閏年檢查）
- 時辰: `0 ≤ hour ≤ 23`，分鐘 `0 ≤ minute ≤ 59`
- 未來日期檢查: 日期不能晚於今天
- 邊界: 1900-01-01 之前或 2100-12-31 之後顯示準確性警告

**狀態轉移**:
```
新建 → 驗證中 → 有效 (可計算八字)
              → 無效 (顯示錯誤)
```

---

### 2. Pillar (柱)

**用途**: 表示八字的四根柱子之一（年月日時）

```typescript
interface Pillar {
  // 天干 (Heavenly Stem)
  heavenlyStem: string;      // 甲、乙、丙、丁、戊、己、庚、辛、壬、癸

  // 地支 (Earthly Branch)
  earthlyBranch: string;     // 子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥

  // 衍生屬性
  element?: string;          // 五行: 木、火、土、金、水
  yin?: boolean;             // 陰陽: false = 陽，true = 陰
  tenGod?: string;           // 十神 (需結合日主計算)
}
```

**計算邏輯**:
- 天干地支由 `bazi` 庫根據日期自動計算
- Element 從天干地支映射得出（參考 baziMappings.ts）
- Yin/Yang 由天干奇偶決定

---

### 3. BaziChart (八字盤)

**用途**: 完整的八字圖表，包括四柱和衍生分析

```typescript
interface BaziChart {
  // 四根柱
  yearPillar: Pillar;        // 年柱
  monthPillar: Pillar;       // 月柱
  dayPillar: Pillar;         // 日柱
  hourPillar: Pillar | null; // 時柱 (可能未知)

  // 五行分佈
  fiveElements: FiveElementsDistribution;

  // 十神配置
  tenGods: TenGodsConfig;

  // 原始數據
  rawData?: any;             // `bazi` 庫的原始輸出

  // 計算參數
  birthProfile: BirthProfile;
  calculatedAt: Date;
  accuracyWarning?: string;  // 若日期超範圍
}

interface FiveElementsDistribution {
  wood: number;              // 木元素計數
  fire: number;              // 火
  earth: number;             // 土
  metal: number;             // 金
  water: number;             // 水

  // 衍生指標
  dominant?: string;         // 最多的元素
  deficient?: string;        // 最少的元素
  balanced?: boolean;        // 是否平衡
}

interface TenGodsConfig {
  // 十神：日主相對於其他干支的關係
  bijiJie: number;           // 比肩 (同陰陽)
  jieYinPie: number;         // 劫刃 (同陰陽但反向)
  shishi: number;            // 食神 (克制五行)
  shangguan: number;         // 傷官 (克制五行反向)
  piCai: number;             // 偏財 (被克)
  zhengCai: number;          // 正財 (被克反向)
  piGuanQi: number;          // 偏官 (克制日主)
  zhengGuanLu: number;       // 正官 (克制日主反向)
  piYin: number;             // 偏印 (生日主)
  zhengYin: number;          // 正印 (生日主反向)
}
```

**計算依賴**:
- 需要 `bazi` 庫輸出 + 自訂映射表
- 十神計算基於日主（dayPillar.heavenlyStem）

---

### 4. AnalysisRules (分析規則)

**用途**: 定義如何從 BaziChart 推導出分析維度

```typescript
interface AnalysisRules {
  // 規則引擎配置
  personalityRules: PersonalityRule[];
  careerRules: CareerRule[];
  wealthRules: WealthRule[];
  relationshipRules: RelationshipRule[];
  outlookRules: OutlookRule[];
}

interface PersonalityRule {
  id: string;                // 規則 ID，如 'person_wood_dominant'
  condition: {
    element?: string;        // 木、火、土、金、水
    tenGod?: string;         // 某十神
    elementBalance?: 'dominant' | 'deficient' | 'balanced';
  };
  traits: string[];          // 推導出的性格特質，如 ['創意', '敏銳']
  description?: string;      // 規則說明
}

interface CareerRule {
  id: string;
  condition: {
    fiveElements?: { element: string; count: number };
    tenGods?: string[];
  };
  strengths: string[];       // 職業優勢
  suggestedPaths?: string[]; // 建議職業方向
}

// 類似結構用於 WealthRule、RelationshipRule、OutlookRule
```

**規則庫** (constants/analysisRuleDefinitions.ts):
- 定義 20–50 條規則，覆蓋常見八字組合
- 每條規則映射 Bazi 指標 → 人格/事業/財運特性
- ChatGPT 會讀取這些規則，生成自然語言分析

---

### 5. AnalysisResult (分析結果)

**用途**: 完整的用戶分析報告，由規則引擎和 ChatGPT 生成

```typescript
interface AnalysisResult {
  // 輸入數據
  profile: BirthProfile;
  chart: BaziChart;

  // 分析內容 (User Story 3 的五個維度)
  analysis: {
    personality: {
      text: string;         // 性格分析文本 (ChatGPT 生成)
      traits: string[];     // 性格特質列表
      sources: string[];    // 推導來源（規則 ID）
    };
    career: {
      text: string;
      strengths: string[];
      suggestedPaths: string[];
      sources: string[];
    };
    wealth: {
      text: string;
      outlook: 'optimistic' | 'cautious' | 'balanced';
      sources: string[];
    };
    relationship: {
      text: string;
      compatibility: string;  // 人際相容性總結
      sources: string[];
    };
    outlook: {
      text: string;
      currentPhase: string;  // 近期運勢階段
      suggestions: string[]; // 實用建議
      sources: string[];
    };
  };

  // 元數據
  generatedAt: Date;
  source: 'rule-engine' | 'chatgpt' | 'hybrid';  // 生成來源
  version: string;          // 分析模型版本
}
```

**流程**:
1. 規則引擎掃描 BaziChart，匹配規則
2. 收集匹配的特質和建議
3. 將規則結果 + 原始圖表 → ChatGPT prompt
4. ChatGPT 生成自然語言分析文本
5. 合併規則提取的數據 + ChatGPT 文本 → AnalysisResult

---

## Relationships (實體關係)

```
BirthProfile
    ↓
BaziChart (計算)
    ↓
AnalysisRules (匹配)
    ↓ + ChatGPT
AnalysisResult (最終報告)
```

**LocalStorage 儲存結構** (單一配置檔案模式):
```json
{
  "savedProfile": {
    "profile": { /* BirthProfile */ },
    "chart": { /* BaziChart */ },
    "analysis": { /* AnalysisResult */ },
    "savedAt": "2026-01-06T10:30:00Z"
  }
}
```

---

## Data Flow

### 用戶故事 1: 輸入驗證
```
UI Input → BirthProfile (驗證) → 有效/無效 (錯誤消息)
```

### 用戶故事 2: 圖表計算
```
BirthProfile → [bazi 庫計算] → BaziChart → UI 顯示
```

### 用戶故事 3: 分析生成
```
BaziChart
  → [規則引擎掃描] → AnalysisRules 匹配結果
  → [構建 ChatGPT prompt]
  → [ChatGPT API 呼叫]
  → [解析回應]
  → AnalysisResult → UI 顯示
```

### 用戶故事 4: 儲存/讀取
```
AnalysisResult → [LocalStorage.save()] → LocalStorage
LocalStorage → [LocalStorage.load()] → AnalysisResult → UI
```

---

## Type Definitions Summary

**檔案**: `src/types/`

```
bazi.types.ts
├── BirthProfile
├── Pillar
├── FiveElementsDistribution
└── BaziChart

analysis.types.ts
├── PersonalityRule
├── CareerRule
├── WealthRule
├── RelationshipRule
├── OutlookRule
├── AnalysisRules
└── AnalysisResult

storage.types.ts
├── SavedProfile
└── StorageOperations

api.types.ts
├── ChatGPTAnalysisRequest
└── ChatGPTAnalysisResponse

validation.types.ts
├── ValidationError
└── ValidationResult
```

---

## 性能考量

### LocalStorage 大小估計
- BirthProfile: ~200 bytes
- BaziChart: ~1–2 KB (含所有屬性)
- AnalysisResult (文本): ~3–5 KB
- **總計**: ~5 KB per 配置檔案
- **LocalStorage 限額**: 通常 5–10 MB，足夠單一配置

### 計算緩存
- BaziChart: 不變（給定日期），使用 TanStack Query 快取
- AnalysisResult: ChatGPT 回應可在記憶體中快取

---
