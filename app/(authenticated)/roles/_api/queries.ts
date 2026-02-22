import { TIndexRoleQueryParams } from "@/schemas/role.schema";
import { TRole } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const roleQueries = {
  list: (api: AxiosInstance, queryParams: TIndexRoleQueryParams) => {
    return queryOptions({
      queryKey: [...ROLE_QUERIES_KEYS.list, queryParams],
      queryFn: async (): Promise<TPaginationResponse<TRole>> => {
        return await api.get("/roles", {
          params: queryParams,
        });
      },
    });
  },
};

const ROLE_QUERIES_KEYS = {
  list: ["roles"] as const,
};
