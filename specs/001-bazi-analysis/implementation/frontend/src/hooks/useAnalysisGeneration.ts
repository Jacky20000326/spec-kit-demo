/**
 * Custom Hook: useAnalysisGeneration
 * TanStack Query useMutation wrapper for ChatGPT analysis generation
 */

import { useMutation } from '@tanstack/react-query';
import { BaziChart, BirthProfile } from '@/types/bazi.types';
import { AnalysisRuleDefinitions } from '@/types/analysis.types';
import { ChatGPTAnalysisService } from '@/services/chatgptAnalysis';
import { useApiKey } from '@/context/ApiKeyContext';

export function useAnalysisGeneration(
  baziChart: BaziChart | null,
  birthProfile: BirthProfile | null
) {
  const { apiKey } = useApiKey();

  return useMutation({
    mutationFn: async (analysisRules: AnalysisRuleDefinitions) => {
      if (!baziChart || !birthProfile || !apiKey) {
        throw new Error('Missing required data for analysis generation');
      }

      const service = new ChatGPTAnalysisService();
      return service.generate({
        baziChart,
        birthProfile,
        analysisRules,
        apiKey,
      });
    },
    retry: 0, // No auto-retry per Constitution
  });
}
