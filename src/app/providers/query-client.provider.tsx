import type { FC, PropsWithChildren } from "react";
import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/tanstack-query/client";

export const QueryClientProvider: FC<PropsWithChildren> = ({ children }) => {
  return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>;
};
