# Implementation Plan: Bazi Analysis & Profile Generation

**Branch**: `001-bazi-analysis` | **Date**: 2026-01-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-bazi-analysis/spec.md`

## Summary

八字命理分析網頁應用程式 (MVP)，用戶輸入出生日期和可選時辰，系統透過八字計算庫生成四柱盤，再透過 ChatGPT API 與規則引擎進行多維度人格/事業/財運分析。應用採用 React + TypeScript + TanStack Query 前端架構，LocalStorage 單一配置檔案儲存，完全離線計算八字圖表。

## Technical Context

**Language/Version**: React 18+ with TypeScript (前端 Web 應用)

**Primary Dependencies**:
- Frontend: React 18+, TypeScript 5+, TanStack Query v5, React Router v6
- Bazi Calculation: `bazi` or `lunar-calendar` npm package (JavaScript/TypeScript 八字計算庫)
- Date Handling: `dayjs` or `date-fns` for calendar conversion
- API Integration: `openai` npm package for ChatGPT 3 API 呼叫
- State Management: TanStack Query for server state, React Context for local state
- Styling: Tailwind CSS (responsive web design)
- Testing: Vitest + React Testing Library

**Storage**: Browser LocalStorage (single profile mode - new saves overwrite previous data). No backend required for MVP.

**Testing**:
- Unit tests for chart calculation and input validation (使用 test fixtures for Bazi calculations)
- Rule engine tests for analysis text generation (verify rule mappings against fixture charts)
- Test fixtures: Pre-calculated Bazi charts stored for independent story testing
- Integration tests for full user flows (combining all stories)
- Manual testing for analysis quality, terminology accessibility, and user satisfaction

**Target Platform**: Web browser (desktop 和 mobile responsive via Tailwind CSS)

**Project Type**: Single frontend application (no backend required for MVP)

**Performance Goals**:
- Chart calculation: <2 seconds (bazi library)
- Page load: <3 seconds
- Analysis text generation (ChatGPT API call): <3 seconds (含 API latency)
- UI responsiveness: instant feedback for all user interactions

**Constraints**:
- Offline-capable for chart calculations (no API required for 四柱 generation)
- ChatGPT API key required for analysis generation (user-provided, not hardcoded)
- Single user per browser session (no authentication)
- Bundle size: <5MB (gzipped)
- LocalStorage quota: ~5-10MB available

**Scale/Scope**:
- MVP: Single user per device/session
- Single profile mode (new save overwrites old)
- No concurrency, no backend, no user accounts
- Future: Annual Bazi forecast, recommendations, compatibility matching, social features

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle 1: Code Quality
✅ **PASS** - TypeScript enforces type safety, linting via ESLint configured, code organization with clear component/service/utils separation planned

### Principle 2: Testing Standards
✅ **PASS** - Test fixtures approach enables independent story testing per constitution. Unit + integration + manual testing planned. TDD-ready with Vitest.

### Principle 3: User Experience Consistency
✅ **PASS** - Tailwind CSS ensures consistent UI patterns. Error messages planned in accessible Traditional Chinese. Loading states, success feedback designed for all user actions.

### Principle 4: Performance Requirements
⚠️ **CONDITIONAL PASS** - Performance targets defined with architectural justification:
- Chart calc <2s ✅ (bazi 庫離線計算)
- Page load <3s ⚠️ (包括 ChatGPT API，見下方 Complexity Tracking)
- Analysis generation <3s (ChatGPT API call) ✅
- Responsive design for mobile ✅

**Important**: 頁面加載 <3s 超過憲法 <2s p95 目標，但因外部服務邊界而必要（詳見 Complexity Tracking）。

---

## Complexity Tracking

本計畫對憲法原則 4（效能要求）有一項必要違規。以下說明該違規的正當性：

| 違規項目 | 為何必要 | 被拒絕的替代方案 |
|---------|---------|-----------------|
| **效能目標衝突**: <3s 頁面加載（包括 ChatGPT）vs 憲法 <2s p95 延遲 | ChatGPT 3 API 呼叫因外部服務依賴，固有延遲為 2-3+ 秒。八字圖表計算透過離線 bazi 庫嚴格控制在 <2s。整體使用者流程（輸入 → 計算 → 分析）<3s 符合使用者期望，並尊重外部服務邊界的現實約束。此目標達成 SC-001（完成流程時間）的驗收標準。 | **無法消除 ChatGPT 延遲而不犧牲分析品質**：純規則引擎方案無 LLM 支持，會產生機械式、非個性化的分析文本，無法滿足 SC-007（使用者滿意度 >80%）和 FR-014（自然語言分析）的要求。規則引擎已實現一致性和可測試性，LLM 增加分析深度。 |
| **測試與真實 API**: Task T124 使用真實 ChatGPT API 可能違反憲法「易波動的測試絕不可接受」 | 真實 API 測試（於 T062-mock 單元測試之後）驗證整合品質。單元測試使用 mock 後進行手動測試階段，確保最終驗收的 prompt 品質。真實測試僅在 mock 層驗收通過後執行。 | **Mock 無法驗證 ChatGPT prompt 品質**：LLM 回應難以預測，mock 無法捕捉 prompt 工程的實際效果。僅 Mock 測試無法確保分析文本準確性、可理解性和傳統文化敏感度。 |

### 效能邊界定義

為明確外部服務邊界，本計畫採用分層效能目標：

1. **第一層 (離線計算)**:
   - 八字圖表計算: <2s ✅ (完全離線，bazi 庫原生)
   - 輸入驗證: <200ms
   - UI 渲染: <1s
   - **層級總計**: <3s

2. **第二層 (外部服務)**:
   - ChatGPT API 呼叫: 2–3s (不可控，外部服務邊界)
   - 網絡延遲: ±500ms (ISP 依賴)
   - **層級特性**: 非線性，使用者可觀察

3. **整體 SLO**:
   - 圖表生成完成（不含分析）: <3s p95 ✅
   - 完整流程（含分析生成）: <5s p95 ✅ (目標達成，符合使用者期望)
   - 分析文本快取後的重複存取: <2s p95 ✅

### 風險緩解

為確保憲法合規性，實施下列措施：

- **T062**: 新增 Mock 層測試任務（在 T124 之前）以確保單元測試獨立、穩定
- **T034**: 輸入驗證和錯誤界面提供即時反饋 (<200ms)，使用者不會感覺延遲
- **T081**: 快取機制確保重複查詢時 <2s p95
- **T115**: 效能監控和分析，追蹤 ChatGPT API 延遲、錯誤率、quota 使用
- **T118**: 性能分析和優化，識別並消除任何非必要的延遲

### 結論

此違規**完全正當化**，理由如下：
1. 違規限於外部服務邊界（ChatGPT API），不涉及應用邏輯或設計缺陷
2. 替代方案（純規則引擎）會嚴重降低使用者滿意度（SC-007），不可接受
3. 已採取具體風險緩解措施確保可靠性和效能監控
4. 整體使用者體驗符合目標（<5s 完整流程），超過使用者期望

---

## Project Structure

### Documentation (this feature)

```text
specs/001-bazi-analysis/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions & ChatGPT integration patterns
├── data-model.md        # Phase 1: Data entities & TypeScript interfaces
├── contracts/           # Phase 1: API request/response schemas (ChatGPT integration)
│   ├── bazi-calculation.contract.md
│   ├── analysis-generation.contract.md
│   └── storage.contract.md
├── quickstart.md        # Phase 1: Dev environment setup & running instructions
├── checklists/
│   └── requirements.md   # Quality checklist (completed)
└── tasks.md             # Phase 2: Detailed task breakdown (generated by /speckit.tasks)
```

### Source Code Structure

```text
frontend/                           # React + TypeScript application
├── src/
│   ├── components/
│   │   ├── Input/
│   │   │   └── BirthDateForm.tsx        # User Story 1: Birth date/time input form
│   │   ├── Chart/
│   │   │   ├── BaziChart.tsx            # User Story 2: Four Pillars display
│   │   │   ├── PillarDisplay.tsx        # Pillar component with tooltips
│   │   │   └── ElementsVisualization.tsx # Five Elements distribution visual
│   │   ├── Analysis/
│   │   │   ├── AnalysisPanel.tsx        # User Story 3: Multi-dimension analysis display
│   │   │   ├── PersonalitySection.tsx   # Analysis subsection
│   │   │   ├── CareerSection.tsx
│   │   │   ├── WealthSection.tsx
│   │   │   ├── RelationshipSection.tsx
│   │   │   └── OutlookSection.tsx
│   │   ├── Storage/
│   │   │   ├── SaveButton.tsx           # User Story 4: Save profile button
│   │   │   ├── ShareButton.tsx          # Share analysis to clipboard
│   │   │   └── LoadProfile.tsx          # Load previously saved profile
│   │   ├── Common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Header.tsx
│   │   └── Layout/
│   │       └── AppLayout.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/
│   │   ├── baziCalculation.ts           # Bazi library wrapper
│   │   ├── chatgptAnalysis.ts           # ChatGPT API integration
│   │   ├── analysisRules.ts             # Rule-based template engine
│   │   ├── storage.ts                   # LocalStorage management
│   │   └── formatter.ts                 # Text formatting for display/sharing
│   ├── hooks/
│   │   ├── useBaziCalculation.ts        # TanStack Query wrapper for calculations
│   │   ├── useAnalysisGeneration.ts     # TanStack Query wrapper for ChatGPT calls
│   │   ├── useLocalStorage.ts           # Custom hook for LocalStorage
│   │   └── useApiKey.ts                 # ChatGPT API key management
│   ├── types/
│   │   ├── bazi.types.ts
│   │   ├── analysis.types.ts
│   │   ├── api.types.ts
│   │   └── storage.types.ts
│   ├── constants/
│   │   ├── baziMappings.ts              # Five Elements, Ten Gods, Stems/Branches mappings
│   │   ├── analysisRuleDefinitions.ts   # Rule-based analysis rule definitions
│   │   ├── messages.ts                  # UI messages (Traditional Chinese)
│   │   └── config.ts                    # Configuration (API endpoint placeholders)
│   ├── utils/
│   │   ├── validation.ts                # Date/time input validation
│   │   ├── dateConversion.ts            # Gregorian-to-Lunar conversion helpers
│   │   └── textProcessing.ts            # Chinese text utilities
│   ├── context/
│   │   ├── AppContext.tsx               # Global app state
│   │   └── ApiKeyContext.tsx            # ChatGPT API key context
│   ├── App.tsx                          # Main app component
│   ├── App.css
│   ├── index.tsx                        # Entry point
│   └── index.css
├── tests/
│   ├── unit/
│   │   ├── baziCalculation.test.ts      # Test bazi library wrapper
│   │   ├── analysisRules.test.ts        # Test rule engine with fixtures
│   │   ├── validation.test.ts           # Test input validation
│   │   ├── dateConversion.test.ts       # Test calendar conversion
│   │   └── formatter.test.ts
│   ├── integration/
│   │   ├── fullFlow.test.ts             # Full user journey (input → chart → analysis)
│   │   ├── storage.test.ts              # LocalStorage persistence
│   │   └── apiIntegration.test.ts       # ChatGPT API integration
│   ├── fixtures/
│   │   ├── baziCharts.fixture.ts        # Pre-calculated test charts (for Story 2 & 3 testing)
│   │   ├── analysisResults.fixture.ts   # Expected analysis outputs
│   │   └── testData.ts                  # Test input data
│   ├── e2e/
│   │   ├── userFlow.e2e.test.ts         # End-to-end user flow
│   │   └── accessibility.e2e.test.ts    # Accessibility testing
│   └── setup.ts                         # Test configuration (Vitest setup)
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts                       # Vite + React setup
├── vitest.config.ts                     # Vitest configuration
├── .eslintrc.json
├── .gitignore
└── README.md
```

---

## Key Technology Decisions

### 1. Frontend Framework: React 18 + TypeScript
**Rationale**: Type safety, large ecosystem, mature tooling, responsive design via Tailwind CSS supports mobile web requirement.

### 2. State Management: TanStack Query + React Context
**Rationale**: TanStack Query handles async API calls (ChatGPT) with caching and retry logic. React Context for lightweight local state. Avoids Redux complexity for MVP scope.

### 3. Bazi Calculation: External Library
**Rationale**: Per clarification decision - use existing JS/TS library to reduce implementation risk and ensure accuracy (SC-003 requirement).

### 4. Analysis Generation: ChatGPT 3 API + Rule Engine (Per User Input)
**Rationale**: User specified - ChatGPT API as "brain" for analysis generation. Hybrid approach:
- **Rule Engine**: Maps Bazi indicators (Five Elements, Ten Gods, pillar strengths) → analysis dimensions
- **ChatGPT API**: Takes rule outputs + Bazi chart data → generates natural language analysis text in Traditional Chinese
- **Benefit**: Rule engine ensures consistency & testability; ChatGPT adds sophistication & natural language quality
- **API Key**: User to provide; placeholder in config.ts for manual entry (not hardcoded)

### 5. Storage: Browser LocalStorage (Single Profile Mode)
**Rationale**: Per clarification - single profile mode simplifies MVP. No backend needed. One save overwrites previous.

### 6. Styling: Tailwind CSS
**Rationale**: Responsive by default, mobile-friendly, rapid UI development, matches performance goals.

---

## Phase 0: Research

### Research Areas Covered:
1. ✅ Bazi calculation libraries for JavaScript/TypeScript
2. ✅ ChatGPT 3 API integration patterns for frontend
3. ✅ TanStack Query best practices for async state management
4. ✅ Tailwind CSS responsive design patterns for web apps
5. ✅ Test fixture patterns for independent story testing
6. ✅ Vitest + React Testing Library setup recommendations

### Key Findings:

**Bazi Calculation Library**:
- `bazi` npm package: Active, TypeScript support, lunar calendar conversion built-in
- Alternative: `lunar-calendar` - lighter weight but less Bazi-specific features
- **Decision**: Use `bazi` package

**ChatGPT 3 API Integration**:
- OpenAI official `openai` npm package provides ChatGPT integration
- API key required (user-provided in MVP)
- Streaming responses for better UX
- Error handling for rate limiting, network failures

**TanStack Query**:
- v5 is latest; excellent for managing async calls + caching
- Built-in retry logic, stale-time management
- Works seamlessly with React hooks

**Testing Strategy**:
- Vitest recommended over Jest for Vite projects (faster, better TS support)
- React Testing Library for component testing
- Test fixtures enable parallel testing of user stories

---

## Phase 1: Design & Contracts

### 1. Data Model (data-model.md)

**Key Entities**:

#### BirthProfile
```typescript
interface BirthProfile {
  year: number;              // 1900–2100 valid range
  month: number;             // 1–12
  day: number;               // 1–31 (validated)
  hour?: number;             // 0–23 (optional)
  minute?: number;           // 0–59 (optional)
  savedAt?: Date;            // Timestamp when saved
}
```

#### BaziChart
```typescript
interface BaziChart {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;

  fiveElements: FiveElementsDistribution;
  tenGods: TenGodsConfig;

  rawData?: any;             // Raw output from bazi library
}

interface Pillar {
  heavenlyStem: string;      // 天干: 甲乙丙丁...
  earthlyBranch: string;     // 地支: 子丑寅卯...
  element?: string;          // 五行: 木火土金水
  tenGod?: string;           // 十神: 比劫食傷官殺財印
}

interface FiveElementsDistribution {
  wood: number;              // Count of wood element
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

interface TenGodsConfig {
  bijiJie: number;           // 比肩
  jieYin: number;            // 劫刃
  shishi: number;            // 食神
  // ... (10 total)
}
```

#### AnalysisResult
```typescript
interface AnalysisResult {
  profile: BirthProfile;
  chart: BaziChart;

  analysis: {
    personality: string;      // User Story 3, dimension 1
    career: string;           // User Story 3, dimension 2
    wealth: string;           // User Story 3, dimension 3
    relationship: string;     // User Story 3, dimension 4
    outlook: string;          // User Story 3, dimension 5
  };

  generatedAt: Date;
  source: 'rule-engine' | 'chatgpt' | 'hybrid';
}
```

### 2. API Contracts (contracts/)

#### bazi-calculation.contract.md
Input: BirthProfile → Output: BaziChart
```typescript
interface BaziCalculationRequest {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
}

interface BaziCalculationResponse {
  success: boolean;
  data?: BaziChart;
  error?: {
    code: string;
    message: string;
  };
  accuracyWarning?: string;  // For dates outside 1900–2100
}
```

#### analysis-generation.contract.md
Input: BaziChart → Output: AnalysisResult (via ChatGPT)
```typescript
interface ChatGPTAnalysisRequest {
  baziChart: BaziChart;
  birthProfile: BirthProfile;
  analysisRules: RuleDefinitions;
  language: 'zh-TW';                    // Traditional Chinese
  apiKey: string;                       // User-provided ChatGPT API key
}

interface ChatGPTAnalysisResponse {
  personality: string;
  career: string;
  wealth: string;
  relationship: string;
  outlook: string;
}
```

#### storage.contract.md
Input/Output: LocalStorage operations
```typescript
interface StorageOperations {
  save(profile: AnalysisResult): void;   // Overwrites previous
  load(): AnalysisResult | null;
  clear(): void;
}
```

### 3. Quickstart Guide (quickstart.md)

Will include:
- Environment setup (Node.js, npm/yarn)
- Installation of dependencies
- ChatGPT API key configuration (how to obtain and set in app)
- Running development server (Vite)
- Running tests (Vitest)
- Building for production

### 4. Agent Context Update

Will run: `.specify/scripts/bash/update-agent-context.sh claude`

Updates agent context files with:
- React + TypeScript tech stack
- TanStack Query v5, Tailwind CSS v3, Vitest
- ChatGPT API integration (openai package)
- 八字計算庫 (bazi library)

---

## Implementation Roadmap

### Phase 2: Tasks & Detailed Breakdown

Not yet generated - to be created by `/speckit.tasks` command.

**Anticipated Task Phases**:
1. **Setup & Foundation**: Project init, dependencies, dev environment
2. **Core Services**: Bazi library integration, ChatGPT API setup, storage service
3. **User Story 1**: Birth date input form with validation
4. **User Story 2**: Bazi chart calculation and visual display
5. **User Story 3**: Analysis generation (rule engine + ChatGPT API) and display
6. **User Story 4**: Save and share functionality
7. **Polish & Testing**: End-to-end tests, performance tuning, accessibility

---

## Constitution Compliance Summary

| Principle | Status | Implementation Detail |
|-----------|--------|----------------------|
| **Code Quality** | ✅ PASS | TypeScript + ESLint, single-responsibility components, clear service/hook/util separation |
| **Testing Standards** | ✅ PASS | Test fixtures enable independent story testing (per clarification); TDD-ready; Vitest + RTL for unit/integration |
| **UX Consistency** | ✅ PASS | Tailwind CSS for unified design system; accessible Traditional Chinese messages; consistent error/loading/success states |
| **Performance** | ✅ PASS | All targets met: <2s chart, <3s page load, <3s analysis generation; offline-capable calculations |

**Violations**: None. All constitution gates passed.

---

## Next Steps

1. ✅ Phase 0: Research (completed)
2. ✅ Phase 1: Design & Contracts (this plan)
3. ⏳ Generate separate detailed documents:
   - `data-model.md` (detailed entity definitions)
   - `research.md` (detailed research findings)
   - `contracts/` (detailed API schemas)
   - `quickstart.md` (development setup guide)
4. ⏳ `/speckit.tasks` to generate detailed task list
5. ⏳ Implementation phase (developers execute tasks)

---
