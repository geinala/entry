"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TGetUsersQueryParams } from "@/server/user/user.schema";
import { TUser } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (options: TGetUsersQueryParams) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["users", options],
    queryFn: async (): Promise<TPaginationResponse<TUser>> => {
      return await api.get("/users", { params: options });
    },
  });
};
