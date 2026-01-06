import { QueryClientProvider } from '@tanstack/react-query';
import { ApiKeyProvider } from '@/context/ApiKeyContext';
import { AppProvider } from '@/context/AppContext';
import { queryClient } from '@/queryClient';
import HomePage from '@/pages/HomePage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ApiKeyProvider>
          <HomePage />
        </ApiKeyProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
