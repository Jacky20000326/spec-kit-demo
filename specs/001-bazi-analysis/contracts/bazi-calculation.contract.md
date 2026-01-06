# Contract: Bazi Chart Calculation Service

**User Story**: 2 - Bazi Chart Generation

---

## Overview

八字計算服務，將出生日期轉換為完整的八字圖表（四柱盤）。

---

## Input Schema

### BaziCalculationRequest

```typescript
interface BaziCalculationRequest {
  // 必填欄位
  year: number;              // 西曆年份，1900–2100
  month: number;             // 月份，1–12
  day: number;               // 日期，1–31

  // 選填欄位
  hour?: number;             // 時辰，0–23
  minute?: number;           // 分鐘，0–59
}
```

### 驗證規則

| 欄位 | 規則 | 錯誤碼 |
|------|------|--------|
| year | `1900 ≤ year ≤ 2100` | `ERR_YEAR_OUT_OF_RANGE` |
| month | `1 ≤ month ≤ 12` | `ERR_INVALID_MONTH` |
| day | 根據月份有效（含閏年） | `ERR_INVALID_DAY` |
| hour | `0 ≤ hour ≤ 23` (若提供) | `ERR_INVALID_HOUR` |
| minute | `0 ≤ minute ≤ 59` (若提供) | `ERR_INVALID_MINUTE` |
| 日期 | 不能晚於今天 | `ERR_FUTURE_DATE` |

---

## Output Schema

### BaziCalculationResponse (成功)

```typescript
interface BaziCalculationResponse {
  success: true;

  data: {
    yearPillar: {
      heavenlyStem: string;  // 甲–癸
      earthlyBranch: string; // 子–亥
      element: string;       // 木、火、土、金、水
    };
    monthPillar: {
      heavenlyStem: string;
      earthlyBranch: string;
      element: string;
    };
    dayPillar: {
      heavenlyStem: string;
      earthlyBranch: string;
      element: string;       // 日主元素
    };
    hourPillar: {
      heavenlyStem: string;
      earthlyBranch: string;
      element: string;
    } | null;                // 無時辰時為 null

    fiveElements: {
      wood: number;
      fire: number;
      earth: number;
      metal: number;
      water: number;
      dominant?: string;     // 最多元素
      deficient?: string;    // 最少元素
    };

    tenGods: {
      // 十神計數
      [key: string]: number;
    };
  };

  meta: {
    calculatedAt: string;    // ISO 8601 時間戳
    dayMaster: string;       // 日主 (day pillar stem)
    lunarDate?: string;      // 轉換後的農曆日期
  };

  accuracyWarning?: null;    // 若日期在 1900–2100 範圍內
}
```

### BaziCalculationResponse (錯誤)

```typescript
interface BaziCalculationErrorResponse {
  success: false;

  error: {
    code: string;                    // ERR_* 錯誤碼
    message: string;                 // 用戶友好的繁體中文訊息
    field?: string;                  // 哪個欄位出錯 (可選)
  };

  data: null;
}
```

### BaziCalculationResponse (超出準確性範圍)

```typescript
interface BaziCalculationWarningResponse {
  success: true;

  data: {
    // 完整的計算結果
    yearPillar: { /* ... */ },
    // ...
  };

  accuracyWarning: {
    message: string;  // "此日期超出保證準確性範圍 (1900–2100)，計算結果為估算精度"
    dateRange: {
      min: number;    // 1900
      max: number;    // 2100
    };
    userDate: number; // 實際輸入的年份
  };

  meta: { /* ... */ };
}
```

---

## 實現細節

### 服務包裝器 (services/baziCalculation.ts)

```typescript
import { calculateBazi } from 'bazi';  // 第三方庫

export class BaziCalculationService {
  calculate(request: BaziCalculationRequest): Promise<BaziCalculationResponse> {
    try {
      // 1. 驗證輸入
      const validation = this.validate(request);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
          data: null,
        };
      }

      // 2. 檢查準確性邊界
      const isInAccuracyRange = request.year >= 1900 && request.year <= 2100;
      const accuracyWarning = isInAccuracyRange ? null : {
        message: '此日期超出保證準確性範圍...',
        dateRange: { min: 1900, max: 2100 },
        userDate: request.year,
      };

      // 3. 呼叫 bazi 庫
      const baziData = calculateBazi({
        year: request.year,
        month: request.month,
        day: request.day,
        hour: request.hour ?? undefined,
      });

      // 4. 轉換為我們的格式
      const response = this.mapBaziOutput(baziData);

      // 5. 計算五行分佈
      const fiveElements = this.calculateFiveElements(baziData);

      // 6. 計算十神
      const tenGods = this.calculateTenGods(baziData);

      return {
        success: true,
        data: {
          ...response,
          fiveElements,
          tenGods,
        },
        accuracyWarning,
        meta: {
          calculatedAt: new Date().toISOString(),
          dayMaster: baziData.dayPillar.stem,
          lunarDate: this.toLunarDateString(baziData),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ERR_CALCULATION_FAILED',
          message: '無法計算八字圖表，請稍後重試',
        },
        data: null,
      };
    }
  }

  private validate(request: BaziCalculationRequest): ValidationResult {
    // 詳細驗證邏輯
  }

  private mapBaziOutput(baziData: any) {
    // 將 bazi 庫輸出轉換為我們的 Pillar 格式
  }

  private calculateFiveElements(baziData: any) {
    // 從四柱計算五行分佈
  }

  private calculateTenGods(baziData: any) {
    // 根據日主計算十神
  }

  private toLunarDateString(baziData: any): string {
    // 轉換為農曆日期字符串
  }
}
```

### TanStack Query Hook (hooks/useBaziCalculation.ts)

```typescript
export function useBaziCalculation(birthProfile: BirthProfile) {
  return useQuery({
    queryKey: ['bazi', JSON.stringify(birthProfile)],
    queryFn: async () => {
      const service = new BaziCalculationService();
      return service.calculate(birthProfile);
    },
    staleTime: Infinity,      // 靜態數據，永不過期
    retry: 1,                 // 失敗時重試一次
    throwOnError: false,      // 錯誤以 data.error 返回
  });
}
```

---

## 測試案例

### Test Case 1: 標準計算

**輸入**:
```json
{
  "year": 1990,
  "month": 5,
  "day": 15,
  "hour": 14,
  "minute": 30
}
```

**預期輸出**:
```json
{
  "success": true,
  "data": {
    "yearPillar": {
      "heavenlyStem": "庚",
      "earthlyBranch": "午",
      "element": "金"
    },
    // ... 月日時柱
    "fiveElements": {
      "wood": 2,
      "fire": 3,
      "earth": 0,
      "metal": 2,
      "water": 1,
      "dominant": "火"
    }
  },
  "accuracyWarning": null
}
```

### Test Case 2: 無時辰

**輸入**:
```json
{
  "year": 1990,
  "month": 5,
  "day": 15
}
```

**預期**:
- `hourPillar` 為 `null`
- 其他柱子正常計算

### Test Case 3: 超出準確性範圍

**輸入**:
```json
{
  "year": 1850,  // < 1900
  "month": 3,
  "day": 20
}
```

**預期**:
- `success: true`
- 返回計算結果但含 `accuracyWarning`

### Test Case 4: 驗證失敗

**輸入**:
```json
{
  "year": 2026,
  "month": 2,
  "day": 30  // 2月沒有30號
}
```

**預期**:
```json
{
  "success": false,
  "error": {
    "code": "ERR_INVALID_DAY",
    "message": "此日期無效 (二月無30日)",
    "field": "day"
  }
}
```

---

## 性能標準

- **計算時間**: < 100ms (Bazi 庫原生速度)
- **記憶體**: < 1MB per 計算
- **緩存**: TanStack Query 永久緩存相同輸入

---
