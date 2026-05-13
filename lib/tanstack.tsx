"use client";

import { TApiValidationErrorResponse, ValidationErrorDetail } from "@/types/response";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, isAxiosError } from "axios";
import { useState } from "react";
import { JSX } from "react/jsx-dev-runtime";
import { toast } from "sonner";

const queryClientInstance = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 1000 * 60 * 5,
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (isAxiosError(error)) {
            if (error.response?.status && error.response.status < 500) {
              return false;
            }
            return failureCount < 3;
          }

          return failureCount < 3;
        },
        throwOnError: (error) => {
          if (isAxiosError(error)) {
            return !!(error.response?.status && error.response.status >= 500);
          }

          return true;
        },
      },
      mutations: {
        retry: (failureCount, error) => {
          if (isAxiosError(error)) {
            if (error.response?.status && error.response.status < 500) {
              return false;
            }
            return failureCount < 3;
          }

          return failureCount < 3;
        },
        gcTime: 1000 * 60 * 5,
        throwOnError: (error) => {
          if (isAxiosError(error)) {
            return !!(error.response?.status && error.response.status >= 500);
          }

          return true;
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (isAxiosError(error)) {
          handleGlobalError(error);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isAxiosError(error)) {
          handleGlobalError(error);
        }
      },
    }),
  });
};

export const QueryProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [queryClient] = useState(() => queryClientInstance());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const handleGlobalError = (error: AxiosError) => {
  if (!error.response) return;

  const status = error.response.status;
  const response = error.response.data;
  const { message } = response as { message?: string };

  switch (status) {
    case 400:
      toast.error(message || "Bad Request");
      break;

    case 401:
      window.location.href = `/sign-in?callbackUrl=${window.location.pathname}`;
      break;

    case 403:
      toast.error(message || "You do not have permission to perform this action.");
      break;

    case 409:
      toast.error(message || "Conflict occurred. Please try again.");
      break;

    case 422:
      const validationErrors = (response as TApiValidationErrorResponse).errors;
      handleZodError(validationErrors);
      break;
  }
};

const handleZodError = (errors: ValidationErrorDetail[]) => {
  const errorMessages = errors.map((e) => `${e.message}`);

  errorMessages.forEach((msg) => toast.error(msg));
};
