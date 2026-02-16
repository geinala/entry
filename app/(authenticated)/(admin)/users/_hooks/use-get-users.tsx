"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TGetUsersQueryParams } from "@/schemas/user.schema";
import { TUser } from "@/types/database";
import { TApiListResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (options: TGetUsersQueryParams) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["users", options],
    queryFn: async (): Promise<TApiListResponse<TUser>> => {
      return await api.get("/users", { params: options });
    },
  });
};
