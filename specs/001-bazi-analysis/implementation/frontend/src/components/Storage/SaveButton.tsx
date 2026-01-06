/**
 * User Story 4: Save Button Component
 * Triggers save action and shows success/error notifications
 */

import { BirthProfile, BaziChart } from '@/types/bazi.types';
import { AnalysisResult } from '@/types/analysis.types';
import { UI_MESSAGES } from '@/constants/messages';

interface SaveButtonProps {
  profile: BirthProfile | null;
  chart: BaziChart | null;
  analysis: AnalysisResult | null;
  onSave: (data: { profile: BirthProfile; chart: BaziChart; analysis: AnalysisResult }) => void;
  isLoading?: boolean;
}

export function SaveButton({
  profile,
  chart,
  analysis,
  onSave,
  isLoading = false,
}: SaveButtonProps) {
  const isReady = profile && chart && analysis;

  const handleClick = () => {
    if (!isReady) return;

    const confirmed = window.confirm('確認要保存此配置嗎？新的保存將覆蓋舊的配置。');
    if (confirmed) {
      onSave({
        profile,
        chart,
        analysis,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isReady || isLoading}
      className="rounded-lg bg-green-500 px-6 py-3 text-white font-medium hover:bg-green-600 disabled:bg-gray-400 transition"
    >
      {isLoading ? UI_MESSAGES.PROCESSING : UI_MESSAGES.SAVE}
    </button>
  );
}
