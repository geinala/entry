"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { GetWaitlistQueryParamsType } from "@/server/waitlist/waitlist.schema";
import { WaitlistEntry } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetWaitlistEntriesQuery = (options: GetWaitlistQueryParamsType) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["waitlist-entries", options],
    queryFn: async (): Promise<TPaginationResponse<WaitlistEntry>> => {
      return await api.get("/waitlist", { params: options });
    },
  });
};
