# Bazi Analysis Web Application

八字命理分析網頁應用 - 輸入出生日期，了解自己的八字命盤。

## 概覽

This is a React + TypeScript web application for Bazi (八字) divination analysis. Users input their birth date and time, and the system calculates their Bazi chart and generates personalized analysis using ChatGPT API.

## 技術堆棧

- **Frontend**: React 18 + TypeScript 5
- **State Management**: TanStack Query v5 + React Context
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Bazi Calculation**: `bazi` npm package
- **AI Analysis**: OpenAI ChatGPT API

## 項目結構

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Input/           # User input forms
│   │   ├── Chart/           # Bazi chart display
│   │   ├── Analysis/        # Analysis results
│   │   ├── Storage/         # Save/load/share
│   │   └── Common/          # Shared components
│   ├── pages/               # Page components
│   ├── services/            # Business logic
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript interfaces
│   ├── constants/           # App constants & mappings
│   ├── context/             # React context providers
│   ├── utils/               # Utility functions
│   └── App.tsx              # Main app component
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   ├── fixtures/            # Test data fixtures
│   └── setup.ts             # Test configuration
├── public/                  # Static assets
└── [config files]           # vite, tailwind, etc.
```

## 安裝和運行

### 前置條件

- Node.js 18+
- npm 9+

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用會在 http://localhost:3000 開啟。

### 構建生產版本

```bash
npm run build
npm run preview
```

## 運行測試

```bash
# 執行所有測試
npm run test

# 監視模式
npm run test -- --watch

# 生成覆蓋率報告
npm run test:coverage
```

## 代碼品質

```bash
# 執行 ESLint
npm run lint

# 自動修復 lint 錯誤
npm run lint:fix

# 使用 Prettier 格式化
npm run format
```

## 使用 ChatGPT API

該應用需要 OpenAI ChatGPT API 金鑰才能生成個性化分析。

### 獲取 API 金鑰

1. 訪問 [OpenAI Platform](https://platform.openai.com)
2. 註冊或登錄您的帳戶
3. 前往 API 金鑰頁面
4. 創建新的 API 金鑰

### 在應用中配置

1. 打開應用
2. 進行到分析步驟
3. 在提示時輸入您的 API 金鑰
4. 金鑰存儲在瀏覽器記憶體中（不持久化）

## 功能

### User Story 1: 出生日期輸入 ✅
- 输入年月日和可選的時辰
- 驗證日期有效性和範圍（1900-2100）
- 顯示準確性警告（超出範圍）
- 實時錯誤提示

### User Story 2: 八字圖表生成 ✅
- 從 Bazi 庫計算四柱盤
- 顯示天干、地支、五行
- 五行分佈可視化（木火土金水）
- 未知時辰的優雅處理

### User Story 3: 個性化分析 ✅
- 規則引擎掃描圖表特徵
- ChatGPT 生成自然語言分析
- 5 維度分析：性格、事業、財運、感情、運勢
- 繁體中文輸出

### User Story 4: 結果保存和分享 ✅
- LocalStorage 單一配置檔案模式
- 分享功能複製到剪貼板
- 載入之前保存的配置
- 覆蓋確認對話框

## API 集成

### Bazi 計算服務

```typescript
const service = new BaziCalculationService();
const response = service.calculate({
  year: 1990,
  month: 5,
  day: 15,
  hour: 14,
  minute: 30,
});
```

### ChatGPT 分析服務

```typescript
const service = new ChatGPTAnalysisService();
const response = await service.generate({
  baziChart: /* ... */,
  birthProfile: /* ... */,
  apiKey: 'sk-...',
});
```

### LocalStorage 服務

```typescript
const service = new StorageService();
service.save({ profile, chart, analysis });
const response = service.load();
```

## 性能目標

- Chart 計算: <2s ✅
- 頁面加載: <3s ✅
- ChatGPT 分析: <3s (含網絡延遲) ✅
- 包大小: <5MB (gzipped) ✅

## 憲法原則 (Constitution)

該項目遵循 4 項重要原則：

1. **代碼品質** - TypeScript + ESLint + 嚴格模式
2. **測試標準** - Test fixtures for independent testing，無易波動測試
3. **UX 一致性** - Tailwind CSS + Traditional Chinese UI
4. **性能要求** - <3s 完整流程，外部 API 邊界正當化

## 發展計劃

### Phase 1-2 ✅ 完成
- 項目設置和基礎設施

### Phase 3-4 ✅ 完成
- User Stories 實現

### Phase 5-6 📋 待做
- 擴展功能 (年度流年、相容性匹配)
- 性能優化

## 疑難排解

### ChatGPT API 错誤

- **401 Unauthorized**: 檢查 API 金鑰有效性
- **429 Rate Limited**: 您的配額已用盡，請查看 OpenAI 帳戶
- **Network Error**: 檢查網絡連接

### 計算錯誤

- **ERR_INVALID_DAY**: 檢查日期有效性 (考慮閏年)
- **ERR_FUTURE_DATE**: 出生日期不能是未來日期
- **ERR_YEAR_OUT_OF_RANGE**: 年份必須在 1900-2100 之間

## 許可證

MIT

## 聯繫與支持

如有問題或建議，請提交 issue 或聯繫開發團隊。

---

**最後更新**: 2026-01-07
**版本**: 0.1.0 (MVP)
