"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { GetWaitlistQueryParamsType } from "@/server/waitlist/waitlist.schema";
import { useQuery } from "@tanstack/react-query";
import { waitlistQueries } from "../_api/queries";

export const useGetWaitlistEntriesQuery = (options: GetWaitlistQueryParamsType) => {
  const api = useAuthenticatedClient();

  return useQuery(waitlistQueries.list(options, api));
};
