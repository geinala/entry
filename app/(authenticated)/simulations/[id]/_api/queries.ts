"use client";

import {
  TLatestRouteBySimulationRow,
  TSimulationWithUploadedFile,
  TVehicle,
} from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

export const SIMULATION_DETAIL_QUERY_KEYS = {
  findFileWithSimulationId: (simulationId: string) => ["simulation-file", simulationId] as const,
  getAllActiveVehicles: (simulationId?: string) => ["active-vehicles", simulationId] as const,
  getFinalRoutes: (simulationId?: string) => ["final-routes", simulationId] as const,
};

export const simulationDetailQueries = {
  findFileWithSimulationId: (api: AxiosInstance, simulationId: string, hasUploadedCSV: boolean) => {
    return queryOptions({
      queryKey: SIMULATION_DETAIL_QUERY_KEYS.findFileWithSimulationId(simulationId),
      queryFn: async (): Promise<TApiSuccessResponseWithData<TSimulationWithUploadedFile>> => {
        return await api.get(`/simulations/${simulationId}/files`);
      },
      enabled: !!simulationId && hasUploadedCSV,
      refetchInterval: (query) => {
        const state: AxiosResponse<TSimulationWithUploadedFile> = query.state.data
          ?.data as unknown as AxiosResponse<TSimulationWithUploadedFile>; // Type assertion to access status

        if (!state) {
          return false; // Stop refetching if there's no data
        }

        const status = state.data?.uploadedFile?.status;

        if (status === "validating" || status === "uploaded") {
          return 3000; // Refetch every 3 seconds while validating
        }

        return false; // Stop refetching for other states
      },
    });
  },
  getAllActiveVehicles: (api: AxiosInstance, simulationId?: string) => {
    return queryOptions({
      queryKey: SIMULATION_DETAIL_QUERY_KEYS.getAllActiveVehicles(simulationId),
      queryFn: async (): Promise<TApiSuccessResponseWithData<TVehicle[]>> => {
        return await api.get(`/simulations/${simulationId}/vehicles`);
      },
      enabled: !!simulationId,
    });
  },
  getFinalRoutes: (api: AxiosInstance, simulationId?: string) => {
    return queryOptions({
      queryKey: SIMULATION_DETAIL_QUERY_KEYS.getFinalRoutes(simulationId),
      queryFn: async (): Promise<TApiSuccessResponseWithData<TLatestRouteBySimulationRow[]>> => {
        return await api.get(`/simulations/${simulationId}/routes`);
      },
      enabled: !!simulationId,
    });
  },
};
