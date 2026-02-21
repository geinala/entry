"use client";

import { TGetWaitlistQueryParams } from "@/schemas/waitlist.schema";
import { TWaitlistEntrySummary } from "@/server/waitlist/waitlist.type";
import { TWaitlistEntry } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const waitlistQueries = {
  list: (params: TGetWaitlistQueryParams, api: AxiosInstance) => {
    return queryOptions({
      queryKey: [...WAITLIST_QUERY_KEYS.list, params],
      queryFn: async (): Promise<
        TPaginationResponse<TWaitlistEntry> & { summary: TWaitlistEntrySummary }
      > => {
        return await api.get("/waitlist", { params });
      },
      staleTime: 0,
    });
  },
};

export const WAITLIST_QUERY_KEYS = {
  list: ["waitlist-entries"] as const,
};
