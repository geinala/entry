"use client";

import { TGetWaitlistQueryParams } from "@/schemas/waitlist.schema";
import { TWaitlistEntry } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const waitlistQueries = {
  list: (params: TGetWaitlistQueryParams, api: AxiosInstance) => {
    return queryOptions({
      queryKey: [...WAITLIST_QUERY_KEYS.list, params],
      queryFn: async (): Promise<TPaginationResponse<TWaitlistEntry>> => {
        return await api.get("/waitlist", { params });
      },
    });
  },
};

export const WAITLIST_QUERY_KEYS = {
  list: ["waitlist-entries"] as const,
};
