"use client";

import { TIndexRoleQueryParams } from "@/schemas/role.schema";
import { TRole } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

export const roleQueries = {
  list: (api: AxiosInstance, queryParams: TIndexRoleQueryParams) => {
    return queryOptions({
      queryKey: [...ROLE_QUERIES_KEYS.list, queryParams],
      queryFn: async (): Promise<TPaginationResponse<TRole>> => {
        const response: AxiosResponse<TPaginationResponse<TRole>> = await api.get("/roles", {
          params: queryParams,
        });

        return response.data;
      },
    });
  },
};

const ROLE_QUERIES_KEYS = {
  list: ["roles"] as const,
};
