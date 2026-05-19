"use client";

import { TCourier, TLatestRouteBySimulationRow } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const SIMULATION_DETAIL_QUERY_KEYS = {
  findFileWithSimulationId: (simulationId: string) => ["simulation-file", simulationId] as const,
  getAllActiveVehicles: (simulationId?: string) => ["active-vehicles", simulationId] as const,
  getFinalRoutes: (simulationId?: string, vehicleId?: number) =>
    ["final-routes", simulationId, vehicleId ?? null] as const,
};

export const simulationDetailQueries = {
  getAllActiveCouriers: (api: AxiosInstance, simulationId?: string) => {
    return queryOptions({
      queryKey: SIMULATION_DETAIL_QUERY_KEYS.getAllActiveVehicles(simulationId),
      queryFn: async (): Promise<TApiSuccessResponseWithData<TCourier[]>> => {
        return await api.get(`/simulations/${simulationId}/couriers`);
      },
      enabled: !!simulationId,
    });
  },
  getFinalRoutes: (api: AxiosInstance, simulationId?: string, vehicleId?: number) => {
    return queryOptions({
      queryKey: SIMULATION_DETAIL_QUERY_KEYS.getFinalRoutes(simulationId, vehicleId),
      queryFn: async (): Promise<TApiSuccessResponseWithData<TLatestRouteBySimulationRow[]>> => {
        return await api.get(`/simulations/${simulationId}/routes`, {
          params: vehicleId ? { vehicleId } : undefined,
        });
      },
      enabled: !!simulationId,
    });
  },
};
