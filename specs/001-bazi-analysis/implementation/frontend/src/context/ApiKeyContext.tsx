import React, { createContext, useContext, useState } from 'react';

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isApiKeySet: () => boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  const setApiKey = (key: string) => {
    if (key.trim()) {
      setApiKeyState(key);
    }
  };

  const clearApiKey = () => {
    setApiKeyState(null);
  };

  const isApiKeySet = () => {
    return apiKey !== null && apiKey.trim().length > 0;
  };

  const value: ApiKeyContextType = {
    apiKey,
    setApiKey,
    clearApiKey,
    isApiKeySet,
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return context;
}
