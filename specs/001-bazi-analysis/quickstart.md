# Quickstart Guide: Bazi Analysis Web App Development

**Date**: 2026-01-06
**Tech Stack**: React 18 + TypeScript + TanStack Query + Tailwind CSS

---

## 1. 環境準備

### 必備工具
- **Node.js**: v18 或更高版本 (LTS 推薦)
- **npm**: v9 或更高版本 (或 yarn, pnpm)
- **Git**: 版本控制
- **Visual Studio Code**: 推薦編輯器

### 驗證安裝
```bash
node --version      # v18.x.x
npm --version       # v9.x.x
git --version       # git version 2.x
```

---

## 2. 專案初始化

### 方式 1: 使用 Vite (推薦)

```bash
# 建立新專案
npm create vite@latest bazi-analysis -- --template react-ts

# 進入目錄
cd bazi-analysis

# 安裝依賴
npm install
```

### 方式 2: 使用 Create React App

```bash
npx create-react-app bazi-analysis --template typescript
cd bazi-analysis
```

**我們推薦方式 1 (Vite)** 因為啟動更快，建置更小。

---

## 3. 安裝核心依賴

```bash
# 核心 React 和狀態管理
npm install react-router-dom @tanstack/react-query axios

# Bazi 計算庫
npm install bazi dayjs

# ChatGPT API
npm install openai

# UI 框架
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 測試框架
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# 開發工具
npm install -D typescript @types/react @types/react-dom @types/node
npm install -D eslint eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D prettier
```

### 檢查 package.json

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x.x",
    "@tanstack/react-query": "^5.x.x",
    "axios": "^1.x.x",
    "bazi": "^1.x.x",
    "dayjs": "^1.x.x",
    "openai": "^4.x.x"
  },
  "devDependencies": {
    "typescript": "^5.x.x",
    "vite": "^5.x.x",
    "@vitejs/plugin-react": "^4.x.x",
    "tailwindcss": "^3.x.x",
    "vitest": "^1.x.x"
  }
}
```

---

## 4. 配置 Tailwind CSS

編輯 `tailwind.config.js`:

```javascript
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        secondary: '#f59e0b',
      },
    },
  },
  plugins: [],
};
```

編輯 `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## 5. 設定 Vite 配置

編輯 `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

---

## 6. 設定 TanStack Query

建立 `src/queryClient.ts`:

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24,  // 24 小時
    },
  },
});
```

編輯 `src/App.tsx`:

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';
import { HomePage } from './pages/HomePage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomePage />
    </QueryClientProvider>
  );
}

export default App;
```

---

## 7. ChatGPT API Key 配置

建立 `src/config.ts`:

```typescript
// API key 將由用戶在 UI 中提供
// 此檔案留空，避免硬編碼 key

export const CHATGPT_CONFIG = {
  // API_KEY 由用戶透過 ApiKeyContext 提供
  MODEL: 'gpt-3.5-turbo',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 2000,
};

export const API_ENDPOINTS = {
  // 前端應用，無後端 endpoints
};
```

建立 `src/context/ApiKeyContext.tsx`:

```typescript
import React, { createContext, useContext, useState } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);

  const clearApiKey = () => setApiKey(null);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return context;
}
```

---

## 8. 專案結構

建立以下檔案和資料夾結構：

```bash
frontend/
├── src/
│   ├── components/
│   │   ├── Input/
│   │   │   └── BirthDateForm.tsx
│   │   ├── Chart/
│   │   │   ├── BaziChart.tsx
│   │   │   └── PillarDisplay.tsx
│   │   ├── Analysis/
│   │   │   └── AnalysisPanel.tsx
│   │   ├── Storage/
│   │   │   └── SaveButton.tsx
│   │   ├── Common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── Layout/
│   │       └── AppLayout.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/
│   │   ├── baziCalculation.ts
│   │   ├── chatgptAnalysis.ts
│   │   ├── storage.ts
│   │   └── analysisRules.ts
│   ├── hooks/
│   │   ├── useBaziCalculation.ts
│   │   ├── useAnalysisGeneration.ts
│   │   ├── useLocalStorage.ts
│   │   └── useApiKey.ts
│   ├── types/
│   │   ├── bazi.types.ts
│   │   ├── analysis.types.ts
│   │   └── api.types.ts
│   ├── constants/
│   │   ├── baziMappings.ts
│   │   ├── analysisRuleDefinitions.ts
│   │   └── messages.ts
│   ├── context/
│   │   └── ApiKeyContext.tsx
│   ├── queryClient.ts
│   ├── config.ts
│   ├── App.tsx
│   └── index.tsx
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── public/
│   └── index.html
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── .gitignore
```

建立基本的資料夾結構：

```bash
mkdir -p src/{components/{Input,Chart,Analysis,Storage,Common,Layout},pages,services,hooks,types,constants,context}
mkdir -p tests/{unit,integration,fixtures}
mkdir -p public
```

---

## 9. 啟動開發伺服器

```bash
# 開發模式（自動重新載入）
npm run dev

# 應用應該在 http://localhost:3000 開啟

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

---

## 10. 測試設定

編輯 `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
  },
});
```

建立 `tests/setup.ts`:

```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as any;
```

運行測試：

```bash
npm run test              # 執行所有測試
npm run test -- --watch  # 監視模式
npm run test -- --ui     # UI 模式
```

---

## 11. ESLint & Prettier 設定

建立 `.eslintrc.json`:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react", "@typescript-eslint"],
  "rules": {
    "react/react-in-jsx-scope": "off"
  }
}
```

建立 `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

在 `package.json` 中添加 scripts：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src"
  }
}
```

---

## 12. Git 初始化

```bash
git init
git add .
git commit -m "init: Bazi analysis web app project setup

- React 18 + TypeScript + Vite
- TanStack Query for state management
- Tailwind CSS for styling
- Vitest + React Testing Library for testing
- Structure ready for implementation
"
```

---

## 13. 首個組件範例

建立 `src/pages/HomePage.tsx`:

```typescript
import React, { useState } from 'react';
import { ApiKeyProvider } from '../context/ApiKeyContext';
import { BirthDateForm } from '../components/Input/BirthDateForm';
import { BaziChart } from '../components/Chart/BaziChart';

export function HomePage() {
  const [currentStep, setCurrentStep] = useState<'input' | 'chart' | 'analysis'>('input');

  return (
    <ApiKeyProvider>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            八字命理分析
          </h1>
          <p className="text-gray-600">輸入您的出生日期，了解自己的八字命盤</p>
        </header>

        <main className="max-w-2xl mx-auto">
          {currentStep === 'input' && (
            <BirthDateForm onNext={() => setCurrentStep('chart')} />
          )}
          {currentStep === 'chart' && (
            <div>圖表將在此顯示</div>
          )}
          {currentStep === 'analysis' && (
            <div>分析將在此顯示</div>
          )}
        </main>
      </div>
    </ApiKeyProvider>
  );
}
```

建立 `src/components/Input/BirthDateForm.tsx`:

```typescript
import React, { useState } from 'react';

interface BirthDateFormProps {
  onNext: () => void;
}

export function BirthDateForm({ onNext }: BirthDateFormProps) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 基本驗證
    if (!year || !month || !day) {
      setError('請填寫所有必填欄位');
      return;
    }

    // 呼叫 Bazi 計算...
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          出生年份
        </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="1990"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        type="submit"
        className="w-full bg-amber-500 text-white font-medium py-2 rounded-lg hover:bg-amber-600 transition"
      >
        下一步
      </button>
    </form>
  );
}
```

---

## 14. 常用命令

```bash
# 開發
npm run dev               # 啟動開發伺服器
npm run build             # 生產構建
npm run preview           # 預覽生產版本

# 測試
npm run test              # 執行測試
npm run test -- --watch  # 監視模式

# 代碼品質
npm run lint              # 執行 ESLint
npm run lint:fix          # 修復 lint 錯誤
npm run format            # 使用 Prettier 格式化

# Git
git status                # 檢查變更
git commit -m "message"   # 提交變更
git push origin main      # 推送到遠端
```

---

## 15. 下一步

1. ✅ 安裝完成專案基礎
2. 📝 按照 `data-model.md` 定義 TypeScript 類型
3. 🔧 按照 `contracts/` 實現服務層
4. 🎨 使用 Tailwind CSS 構建 UI 組件
5. 🧪 編寫單元測試和集成測試
6. 🚀 完成後進行性能優化和無障礙檢查

---

## 常見問題

### Q: 如何設定 ChatGPT API Key？

A: 用戶在應用首頁輸入 API key，儲存在 React Context (記憶體) 中。頁面重新整理後需重新輸入。

### Q: LocalStorage 有大小限制嗎？

A: 通常 5–10 MB。單個配置檔案約 5 KB，足夠儲存。

### Q: 如何執行測試？

A: `npm run test` 執行所有測試。建議在開發時使用 `npm run test -- --watch` 監視模式。

### Q: 生產版本的大小？

A: 優化後應該 < 5MB (gzipped)。使用 `npm run build` 檢查。

---

## 資源與學習

- **React 官方文檔**: https://react.dev
- **Tailwind CSS 文檔**: https://tailwindcss.com
- **TanStack Query 文檔**: https://tanstack.com/query
- **TypeScript 手冊**: https://www.typescriptlang.org/docs
- **Vitest 文檔**: https://vitest.dev

---

祝開發順利！ 🎉
