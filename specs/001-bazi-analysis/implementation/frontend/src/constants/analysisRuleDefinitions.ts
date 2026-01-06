/**
 * Analysis Rule Definitions
 * Predefined rules for mapping Bazi elements to analysis insights
 */

import { AnalysisRuleDefinitions } from '@/types/analysis.types';

export const ANALYSIS_RULES: AnalysisRuleDefinitions = {
  personality: [
    {
      id: 'personality_fire_dominant',
      dimension: 'personality',
      condition: { isDominant: '火' },
      result: {
        traits: ['熱情', '果敢', '直率', '有創意'],
      },
      confidence: 0.9,
    },
    {
      id: 'personality_water_dominant',
      dimension: 'personality',
      condition: { isDominant: '水' },
      result: {
        traits: ['聰慧', '思考深入', '直覺敏銳', '適應能力強'],
      },
      confidence: 0.85,
    },
    {
      id: 'personality_wood_strength',
      dimension: 'personality',
      condition: { element: '木' },
      result: {
        traits: ['進取心強', '樂觀向上', '富有同情心'],
      },
      confidence: 0.8,
    },
    {
      id: 'personality_metal_strength',
      dimension: 'personality',
      condition: { element: '金' },
      result: {
        traits: ['果斷', '有原則', '精準', '執行力強'],
      },
      confidence: 0.8,
    },
  ],

  career: [
    {
      id: 'career_fire_strong',
      dimension: 'career',
      condition: { isDominant: '火' },
      result: {
        strengths: ['領導力', '溝通能力', '創新思維'],
        suggestedPaths: ['管理', '創業', '市場行銷'],
      },
      confidence: 0.85,
    },
    {
      id: 'career_water_strong',
      dimension: 'career',
      condition: { isDominant: '水' },
      result: {
        strengths: ['分析能力', '學習能力', '適應變化'],
        suggestedPaths: ['研究', '策略規劃', '文化創意'],
      },
      confidence: 0.8,
    },
    {
      id: 'career_metal_strong',
      dimension: 'career',
      condition: { element: '金' },
      result: {
        strengths: ['精細度', '紀律性', '執行力'],
        suggestedPaths: ['工程', '財務', '操作管理'],
      },
      confidence: 0.8,
    },
  ],

  wealth: [
    {
      id: 'wealth_balanced',
      dimension: 'wealth',
      condition: { element: '木' },
      result: {
        outlook: 'balanced',
        suggestions: ['穩健投資', '多元收入', '避免過度風險'],
      },
      confidence: 0.75,
    },
    {
      id: 'wealth_metal_weak',
      dimension: 'wealth',
      condition: {},
      result: {
        outlook: 'cautious',
        suggestions: ['謹慎理財', '專注本業', '避免賭博'],
      },
      confidence: 0.7,
    },
  ],

  relationship: [
    {
      id: 'relationship_fire_strong',
      dimension: 'relationship',
      condition: { isDominant: '火' },
      result: {
        traits: ['熱情主動', '容易被吸引', '易於表達'],
        areasOfGrowth: ['耐心聆聽', '尊重他人步調'],
      },
      confidence: 0.8,
    },
    {
      id: 'relationship_water_strong',
      dimension: 'relationship',
      condition: { isDominant: '水' },
      result: {
        traits: ['感受敏銳', '體貼周到', '理解他人'],
        areasOfGrowth: ['表達想法', '設定邊界'],
      },
      confidence: 0.8,
    },
  ],

  outlook: [
    {
      id: 'outlook_positive',
      dimension: 'outlook',
      condition: { element: '火' },
      result: {
        currentPhase: '上升期',
        suggestions: ['把握機會', '主動出擊', '建立人脈'],
      },
      confidence: 0.75,
    },
    {
      id: 'outlook_stable',
      dimension: 'outlook',
      condition: { element: '土' },
      result: {
        currentPhase: '穩定期',
        suggestions: ['深化基礎', '鞏固現有成果', '謹慎規劃'],
      },
      confidence: 0.75,
    },
  ],
};
