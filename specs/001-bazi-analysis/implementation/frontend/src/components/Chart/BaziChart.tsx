/**
 * User Story 2: Bazi Chart Display Component
 * Shows the Four Pillars, Five Elements distribution, and analysis indicators
 */

import { BaziChart, BirthProfile } from '@/types/bazi.types';
import { UI_MESSAGES } from '@/constants/messages';
import { PillarDisplay } from './PillarDisplay';

interface BaziChartDisplayProps {
  chart: BaziChart;
  profile: BirthProfile;
  onNext?: () => void;
}

export function BaziChartDisplay({
  chart,
  profile,
  onNext,
}: BaziChartDisplayProps) {
  return (
    <div className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">
        {UI_MESSAGES.BAZI_CHART}
      </h2>

      {/* Birth Info */}
      <div className="rounded-lg bg-amber-50 p-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">出生日期:</span> {profile.year}年 {profile.month}月 {profile.day}日
          {profile.hour !== undefined && ` ${profile.hour}:${profile.minute || '00'}`}
        </p>
      </div>

      {/* Four Pillars */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">四柱</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <PillarDisplay pillar={chart.yearPillar} label="年柱" />
          <PillarDisplay pillar={chart.monthPillar} label="月柱" />
          <PillarDisplay pillar={chart.dayPillar} label="日柱" />
          {chart.hourPillar ? (
            <PillarDisplay pillar={chart.hourPillar} label="時柱" />
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center">
              <p className="text-sm text-gray-500">{UI_MESSAGES.BIRTH_HOUR}</p>
              <p className="text-xs text-gray-400">未知</p>
            </div>
          )}
        </div>
      </div>

      {/* Five Elements Distribution */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          {UI_MESSAGES.FIVE_ELEMENTS}
        </h3>
        <div className="grid grid-cols-5 gap-2 md:gap-4">
          <ElementBox
            element="木"
            count={chart.fiveElements.wood}
            isDominant={chart.fiveElements.dominant === '木'}
          />
          <ElementBox
            element="火"
            count={chart.fiveElements.fire}
            isDominant={chart.fiveElements.dominant === '火'}
          />
          <ElementBox
            element="土"
            count={chart.fiveElements.earth}
            isDominant={chart.fiveElements.dominant === '土'}
          />
          <ElementBox
            element="金"
            count={chart.fiveElements.metal}
            isDominant={chart.fiveElements.dominant === '金'}
          />
          <ElementBox
            element="水"
            count={chart.fiveElements.water}
            isDominant={chart.fiveElements.dominant === '水'}
          />
        </div>

        {/* Element Summary */}
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm">
            <span className="font-medium">最強元素:</span> {chart.fiveElements.dominant}
          </p>
          <p className="text-sm">
            <span className="font-medium">最弱元素:</span> {chart.fiveElements.deficient}
          </p>
        </div>
      </div>

      {/* Accuracy Warning if applicable */}
      {chart.calculatedAt && (
        <div className="text-xs text-gray-500">
          計算時間: {new Date(chart.calculatedAt).toLocaleString('zh-TW')}
        </div>
      )}

      {/* Action Button */}
      {onNext && (
        <button
          onClick={onNext}
          className="w-full rounded-lg bg-amber-500 px-6 py-3 text-white font-medium hover:bg-amber-600 transition"
        >
          {UI_MESSAGES.NEXT}
        </button>
      )}
    </div>
  );
}

/**
 * Element Display Box
 */
function ElementBox({
  element,
  count,
  isDominant,
}: {
  element: string;
  count: number;
  isDominant: boolean;
}) {
  const colorMap: Record<string, string> = {
    木: 'bg-green-100 border-green-300',
    火: 'bg-red-100 border-red-300',
    土: 'bg-yellow-100 border-yellow-300',
    金: 'bg-gray-100 border-gray-300',
    水: 'bg-blue-100 border-blue-300',
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 text-center ${colorMap[element]} ${
        isDominant ? 'ring-4 ring-amber-500' : ''
      }`}
    >
      <p className="text-lg font-bold text-gray-900">{element}</p>
      <p className="text-2xl font-bold text-gray-800">{count}</p>
      {isDominant && <p className="mt-1 text-xs text-amber-600">✨ 最強</p>}
    </div>
  );
}
