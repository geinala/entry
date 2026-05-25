"use client";

import { getNextPage } from "@/lib/infinite-scroll";
import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import {
  TGlobalAlgorithmSummary,
  TReoptimizationEvent,
  TSimulation,
  TSimulationJob,
  TSimulationLog,
  TSimulationWithDepot,
} from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TIndexQueryParams } from "@/types/query-params";
import { TApiSuccessResponseWithData, TApiSuccessResponseWithPagination } from "@/types/response";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

export const SIMULATIONS_QUERY_KEYS = {
  all: ["simulations"] as const,
  findById: (id: string) => ["simulations", id] as const,
};

export const simulationQueries = {
  list: (api: AxiosInstance, queryParams: TIndexSimulationQueryParams) => {
    return infiniteQueryOptions({
      queryKey: [...SIMULATIONS_QUERY_KEYS.all, queryParams],
      queryFn: async ({ pageParam }): Promise<TPaginationResponse<TSimulation>> => {
        const params = {
          ...queryParams,
          page: pageParam?.page || queryParams.page,
          pageSize: pageParam?.pageSize || queryParams.pageSize,
        };

        const response: AxiosResponse<TApiSuccessResponseWithPagination<TSimulation>> =
          await api.get("/simulations", { params });

        return response.data.data;
      },
      initialPageParam: { page: queryParams.page, pageSize: queryParams.pageSize },
      getNextPageParam: (lastPage) => getNextPage(lastPage),
      select: (data) => data.pages.flatMap((page) => page.data),
    });
  },
  findById: (api: AxiosInstance, id?: string) => {
    return queryOptions({
      queryKey: SIMULATIONS_QUERY_KEYS.findById(id || ""),
      queryFn: async (): Promise<TSimulationWithDepot> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TSimulationWithDepot>> =
          await api.get(`/simulations/${id}`);

        return response.data.data;
      },
      enabled: !!id,
    });
  },
  getDraftSimulationJob: (api: AxiosInstance) => {
    return queryOptions({
      queryKey: ["simulations", "draft-job"] as const,
      queryFn: async (): Promise<TSimulationJob> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TSimulationJob>> =
          await api.get("/simulations/jobs/draft");

        return response.data.data;
      },
      refetchInterval: (query) => {
        const state = query.state.data;
        const isFileValidationStepActive =
          state?.fileValidationStatus === "uploaded" ||
          state?.fileValidationStatus === "validating";
        const isCleaningInProgress = state?.geocodingStatus === "in_progress";
        const isGeocodingInProgress = state?.geocodingStatus === "in_progress";

        if (isFileValidationStepActive || isCleaningInProgress || isGeocodingInProgress) {
          return 5000; // Stop polling if file validation is not active
        }

        return false; // Stop polling in other cases (validation completed/failed, cleaning in progress, geocoding not started/in progress)
      },
      refetchIntervalInBackground: true,
    });
  },
  getLogs: (api: AxiosInstance, simulationId?: string, queryParams?: TIndexQueryParams) => {
    return queryOptions({
      queryKey: ["simulations", simulationId, "logs", queryParams] as const,
      queryFn: async (): Promise<TPaginationResponse<TSimulationLog>> => {
        const response: AxiosResponse<TApiSuccessResponseWithPagination<TSimulationLog>> =
          await api.get(`/simulations/${simulationId}/logs`, { params: queryParams });

        return response.data.data;
      },
      enabled: !!simulationId,
    });
  },
  getGlobalSummaryAlgorithm: (api: AxiosInstance, simulationId?: string, courierId?: string) => {
    return queryOptions({
      queryKey: ["simulations", simulationId, "global-summary", courierId] as const,
      queryFn: async (): Promise<TGlobalAlgorithmSummary> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TGlobalAlgorithmSummary>> =
          await api.get(`/simulations/${simulationId}/algorithms/summary`, {
            params: { courierId },
          });

        return response.data.data;
      },
      enabled: !!simulationId,
    });
  },
  getReoptimizationEvents: ({
    api,
    queryParams,
    simulationId,
  }: {
    api: AxiosInstance;
    queryParams: TIndexQueryParams;
    simulationId?: string;
  }) => {
    return queryOptions({
      queryKey: ["simulations", simulationId, "reoptimization-events"] as const,
      queryFn: async (): Promise<TPaginationResponse<TReoptimizationEvent>> => {
        const response: AxiosResponse<TApiSuccessResponseWithPagination<TReoptimizationEvent>> =
          await api.get(`/simulations/${simulationId}/reoptimizations`, {
            params: queryParams,
          });

        return response.data.data;
      },
      enabled: !!simulationId,
    });
  },
};
