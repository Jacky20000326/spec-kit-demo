/**
 * LocalStorage Persistence Service
 * Handles saving and loading profiles from browser LocalStorage
 */

import { SaveRequest, SaveResponse, LoadResponse, ClearResponse } from '@/types/storage.types';
import { SavedProfile } from '@/types/storage.types';
import { UI_MESSAGES, ERROR_CODES } from '@/constants/messages';
import { STORAGE_KEYS } from '@/config';

export class StorageService {
  save(data: SaveRequest): SaveResponse {
    try {
      const savedProfile: SavedProfile = {
        profile: data.profile,
        chart: data.chart,
        analysis: data.analysis,
        savedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      localStorage.setItem(
        STORAGE_KEYS.SAVED_PROFILE,
        JSON.stringify(savedProfile)
      );

      return {
        success: true,
        message: UI_MESSAGES.SAVED_SUCCESSFULLY,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        return {
          success: false,
          message: UI_MESSAGES.ERR_STORAGE_QUOTA_EXCEEDED,
          error: {
            code: ERROR_CODES.ERR_STORAGE_QUOTA_EXCEEDED,
            message: UI_MESSAGES.ERR_STORAGE_QUOTA_EXCEEDED,
          },
        };
      }

      return {
        success: false,
        message: '保存失敗，請稍後重試',
        error: {
          code: 'ERR_SAVE_FAILED',
          message: '無法保存配置檔案',
        },
      };
    }
  }

  load(): LoadResponse {
    try {
      const json = localStorage.getItem(STORAGE_KEYS.SAVED_PROFILE);

      if (!json) {
        return {
          success: false,
          data: undefined,
          error: {
            code: ERROR_CODES.ERR_NO_SAVED_PROFILE,
            message: UI_MESSAGES.ERR_NO_SAVED_PROFILE,
          },
        };
      }

      const savedProfile = JSON.parse(json) as SavedProfile;

      // Verify version compatibility
      if (!this.isVersionCompatible(savedProfile.version)) {
        return {
          success: false,
          data: undefined,
          error: {
            code: 'ERR_VERSION_MISMATCH',
            message: '保存的配置檔案版本不相容',
          },
        };
      }

      return {
        success: true,
        data: savedProfile,
      };
    } catch (error) {
      if (error instanceof SyntaxError) {
        return {
          success: false,
          data: undefined,
          error: {
            code: ERROR_CODES.ERR_CORRUPTED_DATA,
            message: UI_MESSAGES.ERR_CORRUPTED_DATA,
          },
        };
      }

      return {
        success: false,
        data: undefined,
        error: {
          code: 'ERR_LOAD_FAILED',
          message: '無法讀取保存的配置檔案',
        },
      };
    }
  }

  clear(): ClearResponse {
    try {
      localStorage.removeItem(STORAGE_KEYS.SAVED_PROFILE);
      return {
        success: true,
        message: UI_MESSAGES.PROFILE_CLEARED,
      };
    } catch (error) {
      return {
        success: false,
        message: '無法清除配置檔案',
        error: {
          code: 'ERR_CLEAR_FAILED',
          message: '無法清除保存的配置檔案',
        },
      };
    }
  }

  exists(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SAVED_PROFILE) !== null;
  }

  private isVersionCompatible(version: string): boolean {
    // For now, only support version 1.0.0
    return version === '1.0.0';
  }
}
