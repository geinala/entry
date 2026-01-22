"use client";

import { useQuery } from "@tanstack/react-query";
import useAuthenticatedClient from "./use-authenticated-client";
import { UserWithRoleAndPermissions } from "@/types/database";

export default function useGetUser() {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async (): Promise<UserWithRoleAndPermissions | null> => {
      return api.get("/users/me");
    },
  });
}
