/**
 * Analysis Rule Engine
 * Matches Bazi chart to predefined rules for analysis
 */

import { BaziChart } from '@/types/bazi.types';
import { MatchedRules } from '@/types/analysis.types';
import { ANALYSIS_RULES } from '@/constants/analysisRuleDefinitions';

export class AnalysisRuleEngine {
  match(baziChart: BaziChart): MatchedRules {
    const matches: MatchedRules = {
      personality: [],
      career: [],
      wealth: [],
      relationship: [],
      outlook: [],
    };

    // Match personality rules
    for (const rule of ANALYSIS_RULES.personality) {
      if (this.conditionMet(rule.condition, baziChart)) {
        matches.personality.push({
          ruleId: rule.id,
          traits: rule.result.traits || [],
          confidence: rule.confidence,
        });
      }
    }

    // Match career rules
    for (const rule of ANALYSIS_RULES.career) {
      if (this.conditionMet(rule.condition, baziChart)) {
        matches.career.push({
          ruleId: rule.id,
          strengths: rule.result.strengths || [],
          confidence: rule.confidence,
        });
      }
    }

    // Match wealth rules
    for (const rule of ANALYSIS_RULES.wealth) {
      if (this.conditionMet(rule.condition, baziChart)) {
        matches.wealth.push({
          ruleId: rule.id,
          outlook: rule.result.outlook || 'balanced',
          confidence: rule.confidence,
        });
      }
    }

    // Match relationship rules
    for (const rule of ANALYSIS_RULES.relationship) {
      if (this.conditionMet(rule.condition, baziChart)) {
        matches.relationship.push({
          ruleId: rule.id,
          traits: rule.result.traits || [],
          confidence: rule.confidence,
        });
      }
    }

    // Match outlook rules
    for (const rule of ANALYSIS_RULES.outlook) {
      if (this.conditionMet(rule.condition, baziChart)) {
        matches.outlook.push({
          ruleId: rule.id,
          phase: rule.result.currentPhase || '平穩期',
          confidence: rule.confidence,
        });
      }
    }

    return matches;
  }

  private conditionMet(condition: any, chart: BaziChart): boolean {
    // Check Five Elements
    if (condition.element) {
      const count = this.countElement(condition.element, chart);
      if (count === 0) return false;
    }

    // Check if dominance criteria met
    if (condition.isDominant) {
      if (chart.fiveElements.dominant !== condition.isDominant) {
        return false;
      }
    }

    return true;
  }

  private countElement(element: string, chart: BaziChart): number {
    const elementMap: Record<string, number> = {
      木: chart.fiveElements.wood,
      火: chart.fiveElements.fire,
      土: chart.fiveElements.earth,
      金: chart.fiveElements.metal,
      水: chart.fiveElements.water,
    };
    return elementMap[element] || 0;
  }
}
