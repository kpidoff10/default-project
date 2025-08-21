"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryProviderProps {
  children: React.ReactNode;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps de cache par défaut (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Temps de cache en mémoire (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry automatique en cas d'échec
      retry: (failureCount, error: unknown) => {
        // Ne pas retry pour les erreurs 4xx (erreurs client)
        const errorObj = error as { status?: number };
        if (
          errorObj?.status &&
          errorObj.status >= 400 &&
          errorObj.status < 500
        ) {
          return false;
        }
        // Retry jusqu'à 3 fois pour les autres erreurs
        return failureCount < 3;
      },
      // Refetch automatique quand la fenêtre reprend le focus
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry automatique pour les mutations
      retry: (failureCount, error: unknown) => {
        // Ne pas retry pour les erreurs 4xx
        const errorObj = error as { status?: number };
        if (
          errorObj?.status &&
          errorObj.status >= 400 &&
          errorObj.status < 500
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools désactivés */}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </QueryClientProvider>
  );
}
