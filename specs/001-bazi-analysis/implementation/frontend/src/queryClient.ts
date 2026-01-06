import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Bazi calculations don't change - cache forever
      gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection time
      retry: 1, // Retry once on failure
      throwOnError: false, // Return error in data, don't throw
    },
    mutations: {
      retry: 0, // No retry for mutations (API calls)
    },
  },
});
