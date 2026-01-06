/**
 * Custom Hook: useBaziCalculation
 * TanStack Query wrapper for Bazi chart calculations
 */

import { useQuery } from '@tanstack/react-query';
import { BirthProfile, BaziCalculationResponse } from '@/types/bazi.types';
import { BaziCalculationService } from '@/services/baziCalculation';

export function useBaziCalculation(birthProfile: BirthProfile | null) {
  return useQuery({
    queryKey: ['bazi', JSON.stringify(birthProfile)],
    queryFn: async () => {
      if (!birthProfile) {
        return null;
      }

      const service = new BaziCalculationService();
      return service.calculate(birthProfile);
    },
    enabled: !!birthProfile,
    staleTime: Infinity, // Bazi calculations never change
    gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection
    retry: 1,
    throwOnError: false,
  });
}
