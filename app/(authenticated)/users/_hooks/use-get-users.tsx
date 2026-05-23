"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TUserIndexQueryParams } from "@/schemas/user.schema";
import { TUser } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TApiSuccessResponseWithPagination } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const useGetUsers = (options: TUserIndexQueryParams) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["users", options],
    queryFn: async (): Promise<TPaginationResponse<TUser>> => {
      const response: AxiosResponse<TApiSuccessResponseWithPagination<TUser>> = await api.get(
        "/users",
        { params: options },
      );

      return response.data.data;
    },
  });
};
