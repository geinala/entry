"use client";

import { TAuthenticatedClient } from "@/app/_hooks/use-authenticated-client";
import { TGetWaitlistQueryParams } from "@/schemas/waitlist.schema";
import { TWaitlistEntry } from "@/types/database";
import { TApiListResponse } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";

export const waitlistQueries = {
  list: (params: TGetWaitlistQueryParams, api: TAuthenticatedClient) => {
    return queryOptions({
      queryKey: [...waitlistKeys.list, params],
      queryFn: async (): Promise<TApiListResponse<TWaitlistEntry>> => {
        return await api.get("/waitlist", { params });
      },
    });
  },
};

const waitlistKeys = {
  list: ["waitlist-entries"] as const,
};
