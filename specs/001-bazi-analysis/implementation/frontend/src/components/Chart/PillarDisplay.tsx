/**
 * Pillar Display Component
 * Shows individual Bazi pillar with stem, branch, and element
 */

import { Pillar } from '@/types/bazi.types';

interface PillarDisplayProps {
  pillar: Pillar;
  label: string;
}

export function PillarDisplay({ pillar, label }: PillarDisplayProps) {
  const elementColorMap: Record<string, string> = {
    木: 'bg-green-50 border-green-200',
    火: 'bg-red-50 border-red-200',
    土: 'bg-yellow-50 border-yellow-200',
    金: 'bg-gray-100 border-gray-300',
    水: 'bg-blue-50 border-blue-200',
  };

  const bgColor =
    elementColorMap[pillar.element || ''] || 'bg-gray-50 border-gray-200';

  return (
    <div className={`rounded-lg border-2 p-4 text-center ${bgColor}`}>
      <p className="mb-2 text-xs font-medium text-gray-600">{label}</p>

      {/* Heavenly Stem */}
      <div className="mb-2">
        <p className="text-xs text-gray-500">天干</p>
        <p className="text-2xl font-bold text-gray-900">
          {pillar.heavenlyStem}
        </p>
      </div>

      {/* Earthly Branch */}
      <div className="mb-2">
        <p className="text-xs text-gray-500">地支</p>
        <p className="text-2xl font-bold text-gray-900">
          {pillar.earthlyBranch}
        </p>
      </div>

      {/* Element */}
      {pillar.element && (
        <div>
          <p className="text-xs text-gray-500">五行</p>
          <p className="text-sm font-semibold text-gray-700">
            {pillar.element}
          </p>
        </div>
      )}

      {/* Ten God if available */}
      {pillar.tenGod && (
        <div className="mt-2 border-t pt-2">
          <p className="text-xs text-gray-500">十神</p>
          <p className="text-xs font-medium text-gray-700">{pillar.tenGod}</p>
        </div>
      )}
    </div>
  );
}
