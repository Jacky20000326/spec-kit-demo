/**
 * User Story 4: Share Button Component
 * Copies analysis to clipboard in readable format
 */

import { AnalysisResult } from '@/types/analysis.types';
import { UI_MESSAGES } from '@/constants/messages';

interface ShareButtonProps {
  result: AnalysisResult | null;
}

export function ShareButton({ result }: ShareButtonProps) {
  const handleShare = async () => {
    if (!result) return;

    const text = `
八字命理分析報告
==================
出生日期: ${result.profile.year}年 ${result.profile.month}月 ${result.profile.day}日

【性格特質】
${result.analysis.personality.text}

【事業發展】
${result.analysis.career.text}

【財運走勢】
${result.analysis.wealth.text}

【感情關係】
${result.analysis.relationship.text}

【近期運勢】
${result.analysis.outlook.text}

生成時間: ${new Date(result.generatedAt).toLocaleString('zh-TW')}
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      alert(UI_MESSAGES.COPIED_TO_CLIPBOARD);
    } catch (err) {
      alert('複製失敗，請稍後重試');
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={!result}
      className="rounded-lg bg-blue-500 px-6 py-3 text-white font-medium hover:bg-blue-600 disabled:bg-gray-400 transition"
    >
      {UI_MESSAGES.SHARE}
    </button>
  );
}
