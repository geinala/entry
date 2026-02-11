"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { GetWaitlistQueryParamsType } from "@/server/waitlist/waitlist.schema";
import { WaitlistEntry } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { queryOptions } from "@tanstack/react-query";

export const waitlistQueries = {
  list: (params: GetWaitlistQueryParamsType, api: ReturnType<typeof useAuthenticatedClient>) => {
    return queryOptions({
      queryKey: [waitlistKeys.list(params)],
      queryFn: async (): Promise<TPaginationResponse<WaitlistEntry>> => {
        return await api.get("/waitlist", { params });
      },
    });
  },
};

const waitlistKeys = {
  list: (params: GetWaitlistQueryParamsType) => ["waitlist-entries", params] as const,
};
