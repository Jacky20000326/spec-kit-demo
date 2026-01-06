# Contract: Analysis Generation Service (ChatGPT + Rule Engine)

**User Story**: 3 - Personal Profile Analysis

---

## Overview

分析生成服務，將八字圖表轉換為多維度的個人分析報告。採用混合方式：
1. **規則引擎** 掃描 BaziChart，匹配預定義規則
2. **ChatGPT API** 根據規則結果生成自然語言分析文本

---

## Input Schema

### AnalysisGenerationRequest

```typescript
interface AnalysisGenerationRequest {
  // 必填
  baziChart: BaziChart;                    // 計算的八字圖表
  birthProfile: BirthProfile;              // 用戶出生信息
  analysisRules: AnalysisRuleDefinitions;  // 規則引擎定義

  // ChatGPT 配置
  apiKey: string;                          // OpenAI API key (用戶提供)
  model?: 'gpt-3.5-turbo' | 'gpt-4';      // 預設: gpt-3.5-turbo
  temperature?: number;                   // 預設: 0.7 (0.0–2.0)
  maxTokens?: number;                     // 預設: 2000

  // 個性化
  language: 'zh-TW' | 'zh-CN';            // 預設: zh-TW
  detailLevel?: 'brief' | 'standard' | 'detailed';  // 預設: standard
}
```

---

## Output Schema

### AnalysisGenerationResponse (成功)

```typescript
interface AnalysisGenerationResponse {
  success: true;

  data: {
    personality: {
      text: string;         // ChatGPT 生成的性格分析 (300–500 字)
      traits: string[];     // 提取的性格特質，如 ['創意', '敏銳', '直率']
      ruleMatches: string[]; // 觸發的規則 ID
    };

    career: {
      text: string;         // 事業發展分析 (300–500 字)
      strengths: string[];  // 職業優勢，如 ['領導力', '溝通能力']
      suggestedPaths: string[];  // 建議職業方向，如 ['管理', '創業']
      ruleMatches: string[];
    };

    wealth: {
      text: string;         // 財運分析 (200–400 字)
      outlook: 'optimistic' | 'cautious' | 'balanced';
      suggestions: string[]; // 理財建議
      ruleMatches: string[];
    };

    relationship: {
      text: string;         // 感情/人際分析 (300–500 字)
      strengths: string[];  // 人際優勢
      areasOfGrowth: string[]; // 需要改進的地方
      ruleMatches: string[];
    };

    outlook: {
      text: string;         // 近期運勢分析 (200–400 字)
      currentPhase: string; // 運勢階段，如 '機遇期'、'調整期'
      suggestions: string[]; // 實用建議
      ruleMatches: string[];
    };
  };

  meta: {
    generatedAt: string;    // ISO 8601 時間戳
    model: string;          // 使用的 GPT 模型
    tokensUsed: number;     // 本次呼叫消耗的 tokens
    processingTime: number; // 毫秒
  };
}
```

### AnalysisGenerationResponse (錯誤)

```typescript
interface AnalysisGenerationErrorResponse {
  success: false;

  error: {
    code: string;           // ERR_* 錯誤碼
    message: string;        // 繁體中文錯誤訊息
    details?: string;       // 詳細技術訊息 (開發用)
  };

  data: null;
}
```

---

## 實現細節

### 規則引擎 (services/analysisRules.ts)

```typescript
export class AnalysisRuleEngine {
  match(baziChart: BaziChart): MatchedRules {
    const matches = {
      personality: [] as PersonalityMatch[],
      career: [] as CareerMatch[],
      wealth: [] as WealthMatch[],
      relationship: [] as RelationshipMatch[],
      outlook: [] as OutlookMatch[],
    };

    // 掃描性格規則
    for (const rule of PERSONALITY_RULES) {
      if (this.conditionMet(rule.condition, baziChart)) {
        matches.personality.push({
          ruleId: rule.id,
          traits: rule.traits,
          confidence: this.calculateConfidence(rule, baziChart),
        });
      }
    }

    // 類似掃描其他維度...

    return matches;
  }

  private conditionMet(condition: RuleCondition, chart: BaziChart): boolean {
    // 檢查 Five Elements 分佈
    if (condition.element) {
      const count = this.countElement(condition.element, chart);
      if (count === 0) return false;
    }

    // 檢查十神
    if (condition.tenGod) {
      if (!this.hasTenGod(condition.tenGod, chart)) return false;
    }

    // 檢查元素平衡
    if (condition.elementBalance) {
      if (!this.checkBalance(condition.elementBalance, chart)) return false;
    }

    return true;
  }

  buildPromptContext(matches: MatchedRules): ChatGPTPromptContext {
    // 將匹配結果轉換為 ChatGPT prompt 的背景信息
    return {
      personalityTraits: matches.personality.flatMap(m => m.traits),
      careerStrengths: matches.career.flatMap(m => m.strengths),
      wealthIndicators: matches.wealth.map(m => m.indicator),
      // ...
    };
  }
}
```

### ChatGPT 整合 (services/chatgptAnalysis.ts)

```typescript
export class ChatGPTAnalysisService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generate(request: AnalysisGenerationRequest): Promise<AnalysisGenerationResponse> {
    try {
      // 1. 規則引擎掃描
      const ruleEngine = new AnalysisRuleEngine();
      const matches = ruleEngine.match(request.baziChart);
      const promptContext = ruleEngine.buildPromptContext(matches);

      // 2. 構建 ChatGPT prompt
      const prompt = this.buildPrompt(
        request.baziChart,
        request.birthProfile,
        promptContext,
        request.language,
        request.detailLevel
      );

      // 3. 呼叫 ChatGPT
      const response = await this.client.chat.completions.create({
        model: request.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,  // 見下方
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2000,
      });

      // 4. 解析回應
      const analysisText = response.choices[0].message.content;
      const analysis = this.parseAnalysisText(analysisText);

      // 5. 整合規則結果 + ChatGPT 文本
      return {
        success: true,
        data: {
          personality: {
            text: analysis.personality,
            traits: matches.personality.flatMap(m => m.traits),
            ruleMatches: matches.personality.map(m => m.ruleId),
          },
          career: {
            text: analysis.career,
            strengths: matches.career.flatMap(m => m.strengths),
            suggestedPaths: matches.career.flatMap(m => m.suggestedPaths),
            ruleMatches: matches.career.map(m => m.ruleId),
          },
          // ... 其他維度
        },
        meta: {
          generatedAt: new Date().toISOString(),
          model: request.model || 'gpt-3.5-turbo',
          tokensUsed: response.usage.total_tokens,
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      if (error.code === 'ERR_INSUFFICIENT_QUOTA') {
        return {
          success: false,
          error: {
            code: 'ERR_API_QUOTA_EXCEEDED',
            message: '您的 ChatGPT API 額度已用盡，請檢查帳戶狀態',
          },
          data: null,
        };
      }
      // ... 其他錯誤處理
    }
  }

  private buildPrompt(
    chart: BaziChart,
    profile: BirthProfile,
    context: ChatGPTPromptContext,
    language: string,
    detailLevel: string
  ): string {
    // 返回結構化的 prompt，引導 ChatGPT 生成分析
    return `
你是一位知識淵博的八字命理師。請基於以下八字圖表進行分析。

【八字圖表】
年柱：${chart.yearPillar.heavenlyStem}${chart.yearPillar.earthlyBranch} (${chart.yearPillar.element})
月柱：${chart.monthPillar.heavenlyStem}${chart.monthPillar.earthlyBranch}
日柱：${chart.dayPillar.heavenlyStem}${chart.dayPillar.earthlyBranch} (日主)
時柱：${chart.hourPillar ? chart.hourPillar.heavenlyStem + chart.hourPillar.earthlyBranch : '未知'}

【五行分佈】
木：${chart.fiveElements.wood} 火：${chart.fiveElements.fire} 土：${chart.fiveElements.earth} 金：${chart.fiveElements.metal} 水：${chart.fiveElements.water}

【規則引擎識別的特徵】
${context.personalityTraits.map(t => `- 性格特質：${t}`).join('\n')}
${context.careerStrengths.map(s => `- 職業優勢：${s}`).join('\n')}

請按以下格式提供分析：

【性格特質】
簡潔分析此人性格，基於上述特徵。避免過度神秘化，使用日常語言。(300–500字)

【事業發展】
分析職業方向和發展前景。(300–500字)

【財運走勢】
分析財務狀況和理財建議。(200–400字)

【感情關係】
分析人際和感情狀況。(300–500字)

【近期運勢】
提供近期運勢判斷和實用建議。(200–400字)

回應必須使用繁體中文，避免使用過於專業的八字術語，用易懂的語言解釋。
    `;
  }

  private parseAnalysisText(text: string) {
    // 解析 ChatGPT 回應，提取各維度的文本
    const sections = text.split(/【\w+】/);
    return {
      personality: sections[1]?.trim() || '',
      career: sections[2]?.trim() || '',
      wealth: sections[3]?.trim() || '',
      relationship: sections[4]?.trim() || '',
      outlook: sections[5]?.trim() || '',
    };
  }
}

const SYSTEM_PROMPT = `
你是一位知識淵博且富有同情心的八字命理師。
你的分析應當：
1. 基於傳統八字理論，但用現代、易懂的語言解釋
2. 平衡樂觀與謹慎，提供實用建議而非絕對預言
3. 尊重個人自主性，強調人的努力可以改變命運
4. 避免危言聳聽或過度神秘化
5. 所有分析必須使用繁體中文

回應風格：溫暖、鼓勵、實用、易懂
`;
```

### TanStack Query Hook (hooks/useAnalysisGeneration.ts)

```typescript
export function useAnalysisGeneration(baziChart: BaziChart) {
  const { apiKey } = useApiKey();

  return useMutation({
    mutationFn: async (ruleDefinitions: AnalysisRuleDefinitions) => {
      const service = new ChatGPTAnalysisService(apiKey);
      return service.generate({
        baziChart,
        birthProfile: /* 從 context 取得 */,
        analysisRules: ruleDefinitions,
        apiKey,
      });
    },
    onSuccess: (data) => {
      // 快取生成的分析
      queryClient.setQueryData(['analysis', baziChart], data);
    },
    retry: 0,  // 不自動重試 API 呼叫
  });
}
```

---

## 測試案例

### Test Case 1: 成功的分析生成

**輸入**: 有效的 BaziChart + API key

**預期輸出**:
```json
{
  "success": true,
  "data": {
    "personality": {
      "text": "您天生敏銳，具有創意思維。...",
      "traits": ["創意", "敏銳", "直率"],
      "ruleMatches": ["personality_fire_dominant", "personality_wood_strength"]
    },
    // ... 其他維度
  }
}
```

### Test Case 2: API Key 無效

**輸入**: 無效的 API key

**預期**:
```json
{
  "success": false,
  "error": {
    "code": "ERR_INVALID_API_KEY",
    "message": "ChatGPT API key 無效或已過期"
  }
}
```

### Test Case 3: API 配額已用盡

**預期**: 提示用戶檢查 OpenAI 帳戶

---

## 性能標準

- **ChatGPT API 呼叫時間**: 2–3 秒 (含網絡延遲)
- **規則引擎掃描**: < 50ms
- **總處理時間**: < 3.5 秒 (符合 SC-001 目標)

---

## 安全與成本控制

### API Key 安全
- ✅ Key 不硬編碼
- ✅ Key 不儲存到 LocalStorage
- ✅ Key 存在 React Context (記憶體)
- ✅ 頁面重新整理後需重新輸入

### 成本管理
- gpt-3.5-turbo: ~$0.0005 per 1K tokens (~¥0.015)
- 平均每次分析: 1,500 tokens ≈ $0.0008 (¥0.024)
- 用戶可自行管理配額

---
