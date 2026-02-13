"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TGetWaitlistQueryParams } from "@/server/waitlist/waitlist.schema";
import { TWaitlistEntry } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { queryOptions } from "@tanstack/react-query";

export const waitlistQueries = {
  list: (params: TGetWaitlistQueryParams, api: ReturnType<typeof useAuthenticatedClient>) => {
    return queryOptions({
      queryKey: [waitlistKeys.list(params)],
      queryFn: async (): Promise<TPaginationResponse<TWaitlistEntry>> => {
        return await api.get("/waitlist", { params });
      },
    });
  },
};

const waitlistKeys = {
  list: (params: TGetWaitlistQueryParams) => ["waitlist-entries", params] as const,
};
