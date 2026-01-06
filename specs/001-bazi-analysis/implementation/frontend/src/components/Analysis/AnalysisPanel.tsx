/**
 * User Story 3: Analysis Panel Component
 * Displays multi-dimensional analysis results from ChatGPT
 */

import { AnalysisResult } from '@/types/analysis.types';
import { UI_MESSAGES } from '@/constants/messages';

interface AnalysisPanelProps {
  result: AnalysisResult;
  onSave?: () => void;
  isLoading?: boolean;
}

export function AnalysisPanel({
  result,
  onSave,
  isLoading = false,
}: AnalysisPanelProps) {
  return (
    <div className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">
        {UI_MESSAGES.ANALYSIS}
      </h2>

      {/* Birth Info Summary */}
      <div className="rounded-lg bg-amber-50 p-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">分析對象:</span> {result.profile.year}年 {result.profile.month}月 {result.profile.day}日
        </p>
        <p className="text-xs text-gray-500 mt-1">
          生成時間: {new Date(result.generatedAt).toLocaleString('zh-TW')}
        </p>
      </div>

      {/* Analysis Sections */}
      <div className="space-y-6">
        {/* Personality */}
        <AnalysisSection
          title={UI_MESSAGES.PERSONALITY}
          text={result.analysis.personality.text}
          traits={result.analysis.personality.traits}
        />

        {/* Career */}
        <AnalysisSection
          title={UI_MESSAGES.CAREER}
          text={result.analysis.career.text}
          items={result.analysis.career.strengths}
        />

        {/* Wealth */}
        <AnalysisSection
          title={UI_MESSAGES.WEALTH}
          text={result.analysis.wealth.text}
          items={result.analysis.wealth.suggestions}
        />

        {/* Relationship */}
        <AnalysisSection
          title={UI_MESSAGES.RELATIONSHIP}
          text={result.analysis.relationship.text}
          traits={result.analysis.relationship.traits}
        />

        {/* Outlook */}
        <AnalysisSection
          title={UI_MESSAGES.OUTLOOK}
          text={result.analysis.outlook.text}
          items={result.analysis.outlook.suggestions}
        />
      </div>

      {/* Save Button */}
      {onSave && (
        <button
          onClick={onSave}
          disabled={isLoading}
          className="w-full rounded-lg bg-amber-500 px-6 py-3 text-white font-medium hover:bg-amber-600 disabled:bg-gray-400 transition"
        >
          {isLoading ? UI_MESSAGES.PROCESSING : UI_MESSAGES.SAVE}
        </button>
      )}
    </div>
  );
}

/**
 * Individual Analysis Section
 */
function AnalysisSection({
  title,
  text,
  traits,
  items,
}: {
  title: string;
  text: string;
  traits?: string[];
  items?: string[];
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">{title}</h3>

      {/* Main Text */}
      <p className="mb-4 whitespace-pre-wrap text-gray-700 leading-relaxed">
        {text}
      </p>

      {/* Traits or Items */}
      {traits && traits.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-600">特質:</p>
          <div className="flex flex-wrap gap-2">
            {traits.map((trait, idx) => (
              <span
                key={idx}
                className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {items && items.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600">建議:</p>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start text-sm text-gray-700"
              >
                <span className="mr-3 text-amber-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
