import { tanstackQueryConfig } from "@/config/tanstack";
import { useErrorStore } from "@/shared/stores/error.store";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { CustomAxiosAppError } from "../axios/types";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: tanstackQueryConfig.staleTime,
      retry: tanstackQueryConfig.retry,
      gcTime: tanstackQueryConfig.gcTime,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      useErrorStore.getState().setError(new CustomAxiosAppError(error as AxiosError));
    },
  }),
});
