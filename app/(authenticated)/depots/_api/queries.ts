import { TDepot } from "@/types/database";
import { TDepotOption } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TIndexQueryParams } from "@/types/query-params";
import { TApiSuccessResponseWithData, TApiSuccessResponseWithPagination } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

export const GET_DEPOTS_QUERIES = {
  getDepotsWithPagination: (api: AxiosInstance, queryParams: TIndexQueryParams) => {
    return queryOptions({
      queryKey: ["depots", queryParams],
      queryFn: async (): Promise<TPaginationResponse<TDepot>> => {
        const response: AxiosResponse<TApiSuccessResponseWithPagination<TDepot>> = await api.get(
          "/depots",
          {
            params: queryParams,
          },
        );

        return response.data.data;
      },
    });
  },
  getDepotById: (api: AxiosInstance, id: number) => {
    return queryOptions({
      queryKey: ["depots", id],
      queryFn: async (): Promise<TDepot> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TDepot>> = await api.get(
          `/depots/${id}`,
        );

        return response.data.data;
      },
      enabled: !!id, // Only run this query if id is truthy (not null or undefined)
    });
  },
  getDepotOptions: (api: AxiosInstance) => {
    return queryOptions({
      queryKey: ["depots", "options"],
      queryFn: async (): Promise<TDepotOption[]> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TDepotOption[]>> =
          await api.get("/depots/options");

        return response.data.data;
      },
    });
  },
};
