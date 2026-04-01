"use client";

import { getNextPage } from "@/lib/infinite-scroll";
import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { TSimulationWithDepot } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const SIMULATIONS_QUERY_KEYS = {
  all: ["simulations"] as const,
  findById: (id: string) => ["simulations", id] as const,
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
  findById: (api: AxiosInstance, id?: string) => {
    return queryOptions({
      queryKey: SIMULATIONS_QUERY_KEYS.findById(id || ""),
      queryFn: async (): Promise<TApiSuccessResponseWithData<TSimulationWithDepot>> => {
        return await api.get(`/simulations/${id}`);
      },
      enabled: !!id,
    });
  },
};
