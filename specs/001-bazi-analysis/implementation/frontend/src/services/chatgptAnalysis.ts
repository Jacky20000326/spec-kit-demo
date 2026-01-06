/**
 * ChatGPT Analysis Service
 * Handles integration with OpenAI API for natural language analysis
 */

import {
  AnalysisGenerationRequest,
  AnalysisGenerationResponse,
  AnalysisResult,
} from '@/types/analysis.types';
import { BaziChart, BirthProfile } from '@/types/bazi.types';
import { UI_MESSAGES, ERROR_CODES } from '@/constants/messages';
import { AnalysisRuleEngine } from './analysisRules';

// Mock OpenAI client (would be: import OpenAI from 'openai')
interface MockChatGPTResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    total_tokens: number;
  };
}

export class ChatGPTAnalysisService {
  async generate(
    request: AnalysisGenerationRequest
  ): Promise<AnalysisGenerationResponse> {
    try {
      if (!request.apiKey || !request.apiKey.trim()) {
        return {
          success: false,
          data: null,
          error: {
            code: ERROR_CODES.ERR_API_KEY_MISSING,
            message: UI_MESSAGES.ERR_API_KEY_MISSING,
          },
        };
      }

      const startTime = Date.now();

      // 1. Run rule engine
      const ruleEngine = new AnalysisRuleEngine();
      const matches = ruleEngine.match(request.baziChart);

      // 2. Build prompt
      const prompt = this.buildPrompt(
        request.baziChart,
        request.birthProfile,
        matches,
        request.language || 'zh-TW'
      );

      // 3. Call ChatGPT (mock for now)
      const response = await this.callChatGPT(
        prompt,
        request.apiKey,
        request.model || 'gpt-3.5-turbo',
        request.temperature || 0.7,
        request.maxTokens || 2000
      );

      if (!response) {
        return {
          success: false,
          data: null,
          error: {
            code: ERROR_CODES.ERR_API_KEY_INVALID,
            message: UI_MESSAGES.ERR_API_KEY_INVALID,
          },
        };
      }

      // 4. Parse response
      const analysisText = response.choices[0]?.message?.content || '';
      const analysis = this.parseAnalysisText(analysisText, matches);

      // 5. Combine results
      const result: AnalysisResult = {
        profile: request.birthProfile,
        chart: request.baziChart,
        analysis,
        generatedAt: new Date().toISOString(),
        source: 'hybrid',
      };

      return {
        success: true,
        data: result,
        meta: {
          generatedAt: new Date().toISOString(),
          model: request.model || 'gpt-3.5-turbo',
          tokensUsed: response.usage?.total_tokens || 0,
          processingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          code: 'ERR_ANALYSIS_GENERATION_FAILED',
          message: '無法生成分析，請稍後重試',
          details: error instanceof Error ? error.message : undefined,
        },
      };
    }
  }

  private buildPrompt(
    chart: BaziChart,
    profile: BirthProfile,
    matches: unknown,
    language: string
  ): string {
    return `
你是一位知識淵博的八字命理師。請基於以下八字圖表進行分析。

【出生信息】
年份: ${profile.year}年 ${profile.month}月 ${profile.day}日 ${profile.hour || '未知時'}

【八字圖表】
年柱: ${chart.yearPillar.heavenlyStem}${chart.yearPillar.earthlyBranch}
月柱: ${chart.monthPillar.heavenlyStem}${chart.monthPillar.earthlyBranch}
日柱: ${chart.dayPillar.heavenlyStem}${chart.dayPillar.earthlyBranch}
時柱: ${chart.hourPillar ? chart.hourPillar.heavenlyStem + chart.hourPillar.earthlyBranch : '未知'}

【五行分佈】
木: ${chart.fiveElements.wood}  火: ${chart.fiveElements.fire}  土: ${chart.fiveElements.earth}
金: ${chart.fiveElements.metal}  水: ${chart.fiveElements.water}

請按以下格式提供分析（使用繁體中文，避免過度神秘化）：

【性格特質】
對此人的性格進行簡潔分析（300-500字）

【事業發展】
分析職業方向和發展前景（300-500字）

【財運走勢】
分析財務狀況和理財建議（200-400字）

【感情關係】
分析人際和感情狀況（300-500字）

【近期運勢】
提供近期運勢判斷和實用建議（200-400字）
    `;
  }

  private async callChatGPT(
    prompt: string,
    apiKey: string,
    model: string,
    temperature: number,
    maxTokens: number
  ): Promise<MockChatGPTResponse | null> {
    // Mock implementation - would call actual OpenAI API
    // In production: const client = new OpenAI({ apiKey });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        choices: [
          {
            message: {
              content: `【性格特質】
您天生敏銳，具有創意思維。五行火強，代表熱情果敢，容易成為團隊中的推動者。水弱則需要培養冷靜思考的能力。您適合需要主動性和創新的工作環境。

【事業發展】
根據您的八字，適合從事創意、管理或領導相關工作。火強金弱代表行動力強但需要更多細節執行力。建議在團隊環境中工作，發揮您的領導潛能。

【財運走勢】
金為財星，目前力量不足，建議謹慎理財。避免過度投資，穩健增長是明智之舉。通過正職工作積累財富，短期內有小幅增長機會。

【感情關係】
火強木強代表感情熱烈但有時過於直率。建議更多地聆聽他人想法，培養耐心。您適合尋找能平衡您能量的伴侶，互補性強的關係會更和諧。

【近期運勢】
目前進入一個穩定增長期。把握工作機會，同時注重身心健康。與他人合作時多溝通，會有意想不到的收穫。`,
            },
          },
        ],
        usage: {
          total_tokens: 1500,
        },
      };
    } catch (error) {
      return null;
    }
  }

  private parseAnalysisText(text: string, matches: unknown): any {
    const sections = text.split(/【[\w\s]+】/);

    return {
      personality: {
        text: sections[1]?.trim() || '',
        ruleMatches: [],
      },
      career: {
        text: sections[2]?.trim() || '',
        ruleMatches: [],
      },
      wealth: {
        text: sections[3]?.trim() || '',
        ruleMatches: [],
      },
      relationship: {
        text: sections[4]?.trim() || '',
        ruleMatches: [],
      },
      outlook: {
        text: sections[5]?.trim() || '',
        ruleMatches: [],
      },
    };
  }
}
