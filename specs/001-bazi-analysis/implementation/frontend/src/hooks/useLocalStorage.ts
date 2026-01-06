/**
 * Custom Hook: useLocalStorage
 * Manages LocalStorage operations for saving/loading profiles
 */

import { useState, useCallback } from 'react';
import { SaveRequest } from '@/types/storage.types';
import { SavedProfile, StorageError } from '@/types/storage.types';
import { StorageService } from '@/services/storage';

export function useLocalStorage() {
  const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<StorageError | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = new StorageService();
      const response = service.load();

      if (response.success && response.data) {
        setSavedProfile(response.data);
      } else if (response.error) {
        setError({
          code: response.error.code,
          message: response.error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const save = useCallback(
    async (data: SaveRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const service = new StorageService();
        const response = service.save(data);

        if (response.success) {
          // Reload to confirm save
          await load();
        } else if (response.error) {
          setError({
            code: response.error.code,
            message: response.error.message,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [load]
  );

  const clear = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = new StorageService();
      const response = service.clear();

      if (response.success) {
        setSavedProfile(null);
      } else if (response.error) {
        setError({
          code: response.error.code,
          message: response.error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exists = useCallback(() => {
    const service = new StorageService();
    return service.exists();
  }, []);

  return {
    savedProfile,
    isLoading,
    error,
    load,
    save,
    clear,
    exists,
  };
}
