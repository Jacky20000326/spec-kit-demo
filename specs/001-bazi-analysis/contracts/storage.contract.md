# Contract: LocalStorage Persistence Service

**User Story**: 4 - Result Sharing & Storage

---

## Overview

本地儲存服務，使用瀏覽器 LocalStorage 以單一配置檔案模式儲存和讀取分析結果。新的保存自動覆蓋舊的配置檔案。

---

## Input/Output Schema

### SaveRequest

```typescript
interface SaveRequest {
  profile: BirthProfile;
  chart: BaziChart;
  analysis: AnalysisResult;
}
```

### LoadResponse

```typescript
interface LoadResponse {
  success: boolean;
  data?: SavedProfile;
  error?: {
    code: string;
    message: string;
  };
}

interface SavedProfile {
  profile: BirthProfile;
  chart: BaziChart;
  analysis: AnalysisResult;
  savedAt: Date;
  version: string;  // 資料模型版本
}
```

---

## Storage Schema

### LocalStorage Key

```
Key: "bazi_saved_profile"
Value: JSON string of SavedProfile
```

### 儲存結構

```json
{
  "profile": {
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "savedAt": "2026-01-06T10:30:00Z"
  },
  "chart": {
    "yearPillar": { /* ... */ },
    "monthPillar": { /* ... */ },
    "dayPillar": { /* ... */ },
    "hourPillar": { /* ... */ },
    "fiveElements": { /* ... */ },
    "tenGods": { /* ... */ },
    "calculatedAt": "2026-01-06T10:30:00Z"
  },
  "analysis": {
    "personality": { /* ... */ },
    "career": { /* ... */ },
    "wealth": { /* ... */ },
    "relationship": { /* ... */ },
    "outlook": { /* ... */ },
    "generatedAt": "2026-01-06T10:30:00Z",
    "source": "hybrid"
  },
  "savedAt": "2026-01-06T10:30:00Z",
  "version": "1.0.0"
}
```

---

## API Methods

### StorageService.save()

```typescript
interface StorageService {
  save(data: SaveRequest): SaveResponse;
}

interface SaveResponse {
  success: boolean;
  message: string;
  error?: {
    code: string;
    message: string;
  };
}
```

**行為**:
- 新建或覆蓋 `bazi_saved_profile`
- 自動記錄 `savedAt` 時間戳
- 成功時返回 `{ success: true, message: '配置檔案已保存' }`
- 若 LocalStorage 滿了，返回 quota 錯誤

**實現**:
```typescript
save(data: SaveRequest): SaveResponse {
  try {
    const savedProfile: SavedProfile = {
      profile: data.profile,
      chart: data.chart,
      analysis: data.analysis,
      savedAt: new Date(),
      version: '1.0.0',
    };

    localStorage.setItem(
      'bazi_saved_profile',
      JSON.stringify(savedProfile)
    );

    return {
      success: true,
      message: '配置檔案已成功保存',
    };
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      return {
        success: false,
        message: 'LocalStorage 已滿，無法保存',
        error: {
          code: 'ERR_STORAGE_QUOTA_EXCEEDED',
          message: '瀏覽器儲存空間已滿',
        },
      };
    }
    // ...
  }
}
```

### StorageService.load()

```typescript
load(): LoadResponse {
  try {
    const json = localStorage.getItem('bazi_saved_profile');

    if (!json) {
      return {
        success: false,
        data: null,
        error: {
          code: 'ERR_NO_SAVED_PROFILE',
          message: '尚無保存的配置檔案',
        },
      };
    }

    const savedProfile = JSON.parse(json) as SavedProfile;

    // 驗證版本相容性
    if (!this.isVersionCompatible(savedProfile.version)) {
      return {
        success: false,
        data: null,
        error: {
          code: 'ERR_VERSION_MISMATCH',
          message: '保存的配置檔案版本不相容',
        },
      };
    }

    return {
      success: true,
      data: savedProfile,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        data: null,
        error: {
          code: 'ERR_CORRUPTED_DATA',
          message: '保存的配置檔案已損壞',
        },
      };
    }
    // ...
  }
}
```

### StorageService.clear()

```typescript
clear(): ClearResponse {
  try {
    localStorage.removeItem('bazi_saved_profile');
    return {
      success: true,
      message: '配置檔案已刪除',
    };
  } catch (error) {
    return {
      success: false,
      message: '無法刪除配置檔案',
      error: { /* ... */ },
    };
  }
}
```

### StorageService.exists()

```typescript
exists(): boolean {
  return localStorage.getItem('bazi_saved_profile') !== null;
}
```

---

## Custom Hook

### useLocalStorage()

```typescript
export function useLocalStorage() {
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<StorageError | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const service = new StorageService();
      const response = service.load();

      if (response.success && response.data) {
        setSavedProfile(response.data);
        setError(null);
      } else {
        setError(response.error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const save = useCallback(async (data: SaveRequest) => {
    setIsLoading(true);
    try {
      const service = new StorageService();
      const response = service.save(data);

      if (response.success) {
        // 重新加載確認
        load();
        setError(null);
      } else {
        setError(response.error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [load]);

  const clear = useCallback(async () => {
    setIsLoading(true);
    try {
      const service = new StorageService();
      service.clear();
      setSavedProfile(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    savedProfile,
    isLoading,
    error,
    load,
    save,
    clear,
  };
}
```

---

## 版本遷移 (Migration)

### 版本 1.0.0

初始版本，包含:
- BirthProfile
- BaziChart
- AnalysisResult

### 未來版本

若資料結構變更，需實現遷移邏輯:

```typescript
private migrateData(oldData: any): SavedProfile {
  if (oldData.version === '1.0.0') {
    return oldData as SavedProfile;
  }

  if (oldData.version === '0.9.0') {
    // 0.9.0 → 1.0.0 的遷移邏輯
    return {
      ...oldData,
      version: '1.0.0',
      // ... 其他轉換
    };
  }

  throw new Error(`不支援的版本: ${oldData.version}`);
}
```

---

## 測試案例

### Test Case 1: 首次保存

**操作**:
```javascript
const service = new StorageService();
service.save({
  profile: { year: 1990, month: 5, day: 15 },
  chart: { /* ... */ },
  analysis: { /* ... */ },
});
```

**預期**:
- LocalStorage 中出現 `bazi_saved_profile`
- 可透過 `service.load()` 讀取

### Test Case 2: 覆蓋保存

**操作**:
```javascript
// 第一次保存
service.save(data1);

// 第二次保存（新的配置檔案）
service.save(data2);
```

**預期**:
- LocalStorage 中 `bazi_saved_profile` 值被覆蓋
- `service.load()` 返回 data2，不是 data1

### Test Case 3: 無保存檔案時讀取

**操作**:
```javascript
// 清空 LocalStorage
localStorage.clear();

// 嘗試讀取
const response = service.load();
```

**預期**:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERR_NO_SAVED_PROFILE",
    "message": "尚無保存的配置檔案"
  }
}
```

### Test Case 4: 檔案損壞

**操作**:
```javascript
// 故意損壞 JSON
localStorage.setItem('bazi_saved_profile', 'invalid json {]');

const response = service.load();
```

**預期**: 返回 `ERR_CORRUPTED_DATA` 錯誤

### Test Case 5: 版本不相容

若資料格式升級，舊版本檔案應提示需重新計算。

---

## 大小估計

- **BirthProfile**: ~200 bytes
- **BaziChart**: ~1.5 KB
- **AnalysisResult**: ~3–5 KB
- **Meta (savedAt, version)**: ~50 bytes
- **總計**: ~5 KB
- **LocalStorage 限額**: 5–10 MB (足夠儲存數百個配置檔案)

---

## 隱私與安全

✅ **完全本地**: 所有數據存在用戶裝置上，無上傳至後端
✅ **無加密需求** (MVP): 配置檔案為純文本，不含敏感資訊（只有生日）
⚠️ **共享裝置**: 若多人使用同一瀏覽器，可見彼此保存的配置檔案
🔄 **未來考慮**: 若增加多用戶功能，考慮簡單的加密或用戶分隔

---
