import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  // Глобальна обробка помилок мутацій: локальні onError лишаються для
  // rollback, а логування/нотифікації живуть в одному місці.
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const scope = mutation.options.mutationKey?.join('.') ?? 'mutation';
      console.error(`[${scope}]`, error);
    },
  }),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
