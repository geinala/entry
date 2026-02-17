"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TGetWaitlistQueryParams } from "@/schemas/waitlist.schema";
import { useQuery } from "@tanstack/react-query";
import { waitlistQueries } from "../_api/queries";

export const useGetWaitlistEntriesQuery = (options: TGetWaitlistQueryParams) => {
  const api = useAuthenticatedClient();

  return useQuery(waitlistQueries.list(options, api));
};
