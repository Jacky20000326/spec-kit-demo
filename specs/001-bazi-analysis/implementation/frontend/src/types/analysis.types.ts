/**
 * Analysis Types - Data structures for Bazi analysis results
 */

import { BaziChart, BirthProfile } from './bazi.types';

export interface AnalysisSection {
  text: string;
  ruleMatches?: string[];
  traits?: string[];
  strengths?: string[];
  suggestedPaths?: string[];
  outlook?: 'optimistic' | 'cautious' | 'balanced';
  suggestions?: string[];
  areasOfGrowth?: string[];
  currentPhase?: string;
}

export interface AnalysisResult {
  profile: BirthProfile;
  chart: BaziChart;
  analysis: {
    personality: AnalysisSection;
    career: AnalysisSection;
    wealth: AnalysisSection;
    relationship: AnalysisSection;
    outlook: AnalysisSection;
  };
  generatedAt: string;
  source: 'rule-engine' | 'chatgpt' | 'hybrid';
}

export interface AnalysisGenerationRequest {
  baziChart: BaziChart;
  birthProfile: BirthProfile;
  analysisRules: AnalysisRuleDefinitions;
  apiKey: string;
  model?: 'gpt-3.5-turbo' | 'gpt-4';
  temperature?: number;
  maxTokens?: number;
  language?: 'zh-TW' | 'zh-CN';
  detailLevel?: 'brief' | 'standard' | 'detailed';
}

export interface AnalysisGenerationResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  meta?: {
    generatedAt: string;
    model: string;
    tokensUsed: number;
    processingTime: number;
  };
}

export interface AnalysisRuleDefinition {
  id: string;
  dimension: 'personality' | 'career' | 'wealth' | 'relationship' | 'outlook';
  condition: RuleCondition;
  result: RuleResult;
  confidence: number;
}

export interface RuleCondition {
  element?: string;
  tenGod?: string;
  elementBalance?: Record<string, number>;
  pillarStrength?: Record<string, number>;
}

export interface RuleResult {
  traits?: string[];
  strengths?: string[];
  suggestedPaths?: string[];
  outlook?: string;
  currentPhase?: string;
}

export interface AnalysisRuleDefinitions {
  personality: AnalysisRuleDefinition[];
  career: AnalysisRuleDefinition[];
  wealth: AnalysisRuleDefinition[];
  relationship: AnalysisRuleDefinition[];
  outlook: AnalysisRuleDefinition[];
}

export interface MatchedRules {
  personality: Array<{ ruleId: string; traits: string[]; confidence: number }>;
  career: Array<{ ruleId: string; strengths: string[]; confidence: number }>;
  wealth: Array<{ ruleId: string; outlook: string; confidence: number }>;
  relationship: Array<{ ruleId: string; traits: string[]; confidence: number }>;
  outlook: Array<{ ruleId: string; phase: string; confidence: number }>;
}
