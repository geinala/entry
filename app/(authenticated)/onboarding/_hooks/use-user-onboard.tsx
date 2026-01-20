"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";

export const useUserOnboarding = () => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["onboard-user"],
    queryFn: async (): Promise<{ registered: boolean; redirectTo: string }> => {
      return api.post("/users/onboarding");
    },
  });
};
