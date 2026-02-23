import { getNextPage } from "@/lib/infinite-scroll";
import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

const SIMULATIONS_QUERY_KEYS = {
  all: ["simulations"] as const,
};

export const simulationQueries = {
  list: (api: AxiosInstance, queryParams: TIndexSimulationQueryParams) => {
    return infiniteQueryOptions({
      queryKey: [...SIMULATIONS_QUERY_KEYS.all, queryParams],
      queryFn: async ({ pageParam }) => {
        const params = {
          ...queryParams,
          page: pageParam?.page || queryParams.page,
          pageSize: pageParam?.pageSize || queryParams.pageSize,
        };

        return await api.get("/simulations", { params });
      },
      initialPageParam: { page: queryParams.page, pageSize: queryParams.pageSize },
      getNextPageParam: (lastPage) => getNextPage(lastPage),
      select: (data) => data.pages.flatMap((page) => page.data.data),
    });
  },
};
