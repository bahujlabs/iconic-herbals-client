import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useUiStore } from "../store/uiStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failCount, error) => {
        // Don't retry on 401/403/404
        const status = error?.response?.status;
        if ([401, 403, 404].includes(status)) return false;
        return failCount < 2;
      },
      staleTime: 1000 * 60 * 5, // 5 min
      gcTime: 1000 * 60 * 30, // 30 min
      refetchOnWindowFocus: false,
    },
    mutations: {
      onerror: (error) => {
        const msg = error?.response?.data?.message ?? "Something went wrong";
        useUiStore.getState().toast(msg, "error");
      },
    },
  },
});

export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
