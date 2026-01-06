/**
 * User Story 4: Load Profile Component
 * Loads previously saved profile from LocalStorage
 */

import { SavedProfile } from '@/types/storage.types';
import { UI_MESSAGES } from '@/constants/messages';

interface LoadProfileProps {
  savedProfile: SavedProfile | null;
  onLoad: (profile: SavedProfile) => void;
  isLoading?: boolean;
}

export function LoadProfile({
  savedProfile,
  onLoad,
  isLoading = false,
}: LoadProfileProps) {
  if (!savedProfile) {
    return (
      <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-600">
        <p>{UI_MESSAGES.ERR_NO_SAVED_PROFILE}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-6">
      <h3 className="font-semibold text-gray-900">已保存的配置</h3>

      <div className="text-sm text-gray-700">
        <p>
          <span className="font-medium">出生日期:</span> {savedProfile.profile.year}年 {savedProfile.profile.month}月 {savedProfile.profile.day}日
        </p>
        <p className="mt-1 text-xs text-gray-600">
          保存時間: {new Date(savedProfile.savedAt).toLocaleString('zh-TW')}
        </p>
      </div>

      <button
        onClick={() => onLoad(savedProfile)}
        disabled={isLoading}
        className="w-full rounded-lg bg-amber-500 px-4 py-2 text-white font-medium hover:bg-amber-600 disabled:bg-gray-400 transition"
      >
        {isLoading ? UI_MESSAGES.PROCESSING : UI_MESSAGES.LOAD}
      </button>
    </div>
  );
}
