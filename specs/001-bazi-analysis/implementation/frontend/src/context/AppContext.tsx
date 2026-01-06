import React, { createContext, useContext, useState } from 'react';
import { BirthProfile, BaziChart } from '@/types/bazi.types';
import { AnalysisResult } from '@/types/analysis.types';

interface AppContextType {
  birthProfile: BirthProfile | null;
  setBirthProfile: (profile: BirthProfile) => void;
  clearBirthProfile: () => void;

  baziChart: BaziChart | null;
  setBaziChart: (chart: BaziChart) => void;
  clearBaziChart: () => void;

  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult) => void;
  clearAnalysisResult: () => void;

  clearAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [birthProfile, setBirthProfile] = useState<BirthProfile | null>(null);
  const [baziChart, setBaziChart] = useState<BaziChart | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const clearBirthProfile = () => setBirthProfile(null);
  const clearBaziChart = () => setBaziChart(null);
  const clearAnalysisResult = () => setAnalysisResult(null);

  const clearAll = () => {
    setBirthProfile(null);
    setBaziChart(null);
    setAnalysisResult(null);
  };

  const value: AppContextType = {
    birthProfile,
    setBirthProfile,
    clearBirthProfile,

    baziChart,
    setBaziChart,
    clearBaziChart,

    analysisResult,
    setAnalysisResult,
    clearAnalysisResult,

    clearAll,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
