# Research: Bazi Analysis Web App - Technical Deep Dive

**Date**: 2026-01-06
**Feature**: 001-bazi-analysis
**Phase**: Phase 0 Research (Completed)

---

## 1. Bazi Calculation Library Selection

### Question
如何在 JavaScript/TypeScript 中實現準確的八字計算？是否有現成的庫可用？

### Decision
**使用 `bazi` npm package** - JavaScript/TypeScript 八字計算庫

### Rationale
1. **準確性**: 該庫經過驗證，支持傳統八字排盤規則
2. **功能完整**: 包含農曆轉換、天干地支計算、五行配置、十神判斷
3. **TypeScript 支持**: 有型別定義，適合 TypeScript 專案
4. **維護中**: 庫仍在維護，issue 回應及時
5. **符合澄清決策**: 使用現成庫減低風險、確保準確性

### Alternatives Considered
- **lunar-calendar**: 較輕量級，但八字特定功能較少
- **自行實現**: 高風險、時間成本高、容易出錯
- **其他 npm 包**: `moment-lunar`, `lunisolar` 等功能限制

### npm Package Details
```json
{
  "package": "bazi",
  "latest-version": "1.x or latest",
  "dependencies": ["dayjs or moment"],
  "installation": "npm install bazi dayjs",
  "usage": "import { calculateBazi } from 'bazi'",
  "typescript": true
}
```

### Implementation Notes
- 庫輸出格式: 需確認與我們的 BaziChart 界面兼容
- 日期格式: 庫接受 Date object 或字符串
- 時辰處理: 無時辰時返回 null，需妥善處理
- 誤差邊界: 確認是否支持 1900–2100 精準轉換

---

## 2. ChatGPT 3 API Integration

### Question
如何在前端應用中安全地整合 ChatGPT API？如何處理 API key？

### Decision
**使用 OpenAI 官方 `openai` npm package** - ChatGPT API 客戶端庫

### Rationale
1. **官方支持**: OpenAI 官方維護，最新 API 支持
2. **文檔完善**: 詳細文檔，易於集成
3. **錯誤處理**: 內置重試、rate limiting 處理
4. **TypeScript 支持**: 完整型別定義
5. **Streaming**: 支持流式回應，改善 UX

### API Key Management (MVP 策略)
**方案: 用戶在 UI 中手動提供 API key（不儲存、不硬編碼）**

```typescript
// config.ts - 佔位符
export const CHATGPT_CONFIG = {
  API_KEY: process.env.REACT_APP_CHATGPT_API_KEY || '',  // 留空，由用戶填入
  MODEL: 'gpt-3.5-turbo',
  TIMEOUT: 30000,  // 30 秒
};
```

**用戶設定流程**:
1. 用戶在應用首頁提供 ChatGPT API key（簡單表單）
2. Key 儲存在 React Context（僅記憶體，不持久化）
3. 每次 API 呼叫時使用該 key
4. 頁面重新整理後需重新輸入（安全考量）

### npm Package Details
```json
{
  "package": "openai",
  "latest-version": "4.x",
  "installation": "npm install openai",
  "usage": "import OpenAI from 'openai'",
  "models": ["gpt-3.5-turbo", "gpt-4"],
  "typescript": true
}
```

### Integration Pattern
```typescript
// services/chatgptAnalysis.ts
import OpenAI from 'openai';

class ChatGPTAnalyzer {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateAnalysis(
    baziChart: BaziChart,
    ruleDefinitions: RuleDefinitions
  ): Promise<AnalysisText> {
    try {
      const prompt = this.buildPrompt(baziChart, ruleDefinitions);
      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      });
      return this.parseResponse(response);
    } catch (error) {
      // Handle API errors, rate limiting, timeouts
    }
  }
}
```

### Implementation Considerations
- **Prompt Engineering**: 設計清晰的 prompt，引導 ChatGPT 生成傳統中文八字分析
- **Streaming**: 考慮使用 streaming 對應長文本，改善用戶體驗
- **成本控制**: gpt-3.5-turbo 成本較低，適合 MVP
- **缓存**: TanStack Query 可快取重複查詢，減少 API 呼叫

---

## 3. TanStack Query 狀態管理

### Question
如何在 React 中高效管理非同步 API 呼叫（Bazi 計算、ChatGPT 分析）？

### Decision
**使用 TanStack Query v5** - React Query 的新名稱，專業級非同步狀態管理

### Rationale
1. **非同步流程管理**: 自動處理 loading、error、success 狀態
2. **快取策略**: 智能快取減少不必要的重複呼叫
3. **重試機制**: 自動重試失敗的請求
4. **DevTools**: 強大的開發工具進行 debug
5. **TypeScript 優先**: 完整型別支持

### vs React Context/Redux
- **Redux**: 過度設計，MVP 不需要
- **Context**: 適合簡單狀態，但非同步邏輯複雜
- **TanStack Query**: 專為非同步設計，最佳實踐

### 架構決策
```typescript
// 分離關注點
// 1. API 非同步狀態 → TanStack Query
// 2. 本機非同步狀態 → TanStack Query (useQuery for reading)
// 3. 全域 UI 狀態 (theme, apiKey) → React Context
// 4. 表單狀態 → React Hook Form (可選)
```

### Hook 範例
```typescript
// hooks/useBaziCalculation.ts
export function useBaziCalculation(birthProfile: BirthProfile) {
  return useQuery({
    queryKey: ['bazi', JSON.stringify(birthProfile)],
    queryFn: () => baziService.calculate(birthProfile),
    staleTime: Infinity,  // 靜態數據，不會過期
  });
}

// hooks/useAnalysisGeneration.ts
export function useAnalysisGeneration(baziChart: BaziChart) {
  const { apiKey } = useApiKey();

  return useMutation({
    mutationFn: (ruleDefinitions: RuleDefinitions) =>
      chatgptService.analyze(baziChart, ruleDefinitions, apiKey),
    onSuccess: (data) => {
      // 快取結果
      queryClient.setQueryData(['analysis', baziChart], data);
    },
  });
}
```

---

## 4. Tailwind CSS 響應式設計

### Question
如何實現桌面與行動平台的響應式設計，符合性能目標？

### Decision
**使用 Tailwind CSS v3+** - 工具優先的 CSS 框架

### Rationale
1. **內建響應式**: 簡單的斷點系統（sm, md, lg, xl）
2. **性能優化**: PurgeCSS 自動移除未使用樣式
3. **快速開發**: 實用工具類加速開發
4. **可定製**: 支持自訂主色、字體等
5. **行動優先**: 預設行動設計，升級到桌面

### 響應式斷點設計
```
sm: 640px   - 手機 (小)
md: 768px   - 平板
lg: 1024px  - 桌面
xl: 1280px  - 寬螢幕
```

### 核心組件設計
```tsx
// 八字圖表顯示：行動堆疊，桌面並排
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 四根柱子 */}
</div>

// 分析面板：行動單欄，桌面多欄
<div className="flex flex-col lg:flex-row gap-6">
  {/* 五個分析維度 */}
</div>
```

### 性能考量
- **Critical CSS**: 首屏必需樣式最小化
- **Lazy Loading**: 非首屏組件延遲加載
- **Image Optimization**: 如有圖表，進行優化

---

## 5. 測試策略 & Test Fixtures

### Question
如何測試有複雜依賴關係的 React 組件，同時保持故事獨立性？

### Decision
**Test Fixtures 方法** - 預計算的測試數據集合，支援並行測試

### Rationale (符合澄清決策)
1. **故事獨立性**: 每個故事可用 fixture 獨立測試
2. **並行執行**: 故事測試無依賴，可並行跑
3. **可預測性**: Fixture 數據固定，測試結果確定
4. **易於維護**: 一旦 fixture 驗證正確，測試穩定

### 測試分層
```
1. Unit Tests (Vitest)
   ├── Input validation (Story 1)
   ├── Bazi calculation wrapper (Story 2 - using fixtures)
   ├── Rule engine (Story 3 - using fixtures)
   └── Storage service (Story 4)

2. Integration Tests (Vitest + RTL)
   ├── Full flow: Input → Chart → Analysis (Stories 1-3)
   ├── Save & Load (Story 4)
   └── Error handling

3. E2E Tests (Playwright/Cypress)
   ├── Complete user journey
   └── Real browser testing

4. Fixtures
   ├── baziCharts.fixture.ts
   │   └── 20+ pre-calculated Bazi charts with varied pillar combinations
   └── testData.ts
       └── Birth profile test data (valid, invalid, edge cases)
```

### Fixture 結構
```typescript
// tests/fixtures/baziCharts.fixture.ts

export const TEST_CHARTS = {
  // 案例 1: 標準圖表（所有柱子已知）
  standardChart: {
    yearPillar: { stem: '甲', branch: '子', ... },
    monthPillar: { ... },
    dayPillar: { ... },
    hourPillar: { ... },
    fiveElements: { wood: 2, fire: 1, ... },
    tenGods: { ... },
  },

  // 案例 2: 無時辰圖表（時柱未知）
  noHourChart: {
    yearPillar: { ... },
    monthPillar: { ... },
    dayPillar: { ... },
    hourPillar: null,  // ← Story 2 測試此情況
    fiveElements: { ... },
  },

  // ... 更多案例
};

// 每個 fixture 對應已驗證的分析結果
export const EXPECTED_ANALYSES = {
  standardChart: {
    personality: "...",  // 預期文本
    career: "...",
    ...
  },
};
```

### Vitest 配置
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

---

## 6. React + TypeScript 最佳實踐

### 組件架構
```
Smart Components (Containers)
├── Connect to hooks (TanStack Query, Context)
├── Handle business logic
└── Pass data to Presentational Components

Presentational Components
├── Pure functions
├── Props only
└── Focus on UI/UX
```

### 類型安全
```typescript
// types/bazi.types.ts
export interface BaziChart {
  yearPillar: Pillar;
  // ... 完整類型定義
}

// components/Chart/BaziChart.tsx
interface BaziChartProps {
  chart: BaziChart;
  onLoaded?: () => void;
}

export const BaziChart: React.FC<BaziChartProps> = ({ chart }) => {
  // ...
};
```

---

## 7. 構建工具: Vite

### 選擇原因
1. **極快開發伺服器**: Instant HMR (Hot Module Replacement)
2. **原生 ES Module**: 使用現代 JavaScript
3. **最小化構建**: 優化生產包大小
4. **TypeScript 開箱即用**: 無需額外配置
5. **生態成熟**: 官方支持 React

### 配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: 'hidden',  // 生產隱藏 sourcemap
  },
  server: {
    port: 3000,
  },
});
```

---

## 總結 & 關鍵決策

| 決策領域 | 選擇 | 優勢 |
|---------|------|------|
| **八字計算** | `bazi` 庫 | 準確、完整、維護中 |
| **ChatGPT 整合** | OpenAI 官方 package | 官方支持、文檔完善 |
| **API Key** | 用戶提供、Context 儲存 | 安全、簡單、無後端 |
| **狀態管理** | TanStack Query + Context | 非同步管理優秀、簡單 |
| **樣式** | Tailwind CSS | 響應式、快速、優化 |
| **測試策略** | Test Fixtures | 獨立故事、可並行執行 |
| **測試框架** | Vitest + RTL | 快速、TS 友好 |
| **構建工具** | Vite | 快速、輕量、現代 |

---

## 推薦的開發流程

1. **環境設定** (Day 1)
   - Node.js + npm setup
   - Vite + React + TypeScript 初始化
   - Tailwind CSS 配置
   - Vitest + RTL 設定

2. **核心集成** (Day 2-3)
   - Bazi 庫集成 & 測試
   - ChatGPT API 包裝服務
   - TanStack Query 提供者設定
   - LocalStorage 服務

3. **UI 組件** (Day 4-6)
   - 輸入表單 (Story 1)
   - 圖表顯示 (Story 2)
   - 分析面板 (Story 3)
   - 儲存/分享 (Story 4)

4. **測試 & 優化** (Day 7-8)
   - Unit 測試補全
   - 集成測試
   - 性能優化
   - 無障礙檢查

---
