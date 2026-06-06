"use client";

import { TCourier, TLatestRouteBySimulationRow } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

const SIMULATION_DETAIL_QUERY_KEYS = {
  findFileWithSimulationId: (simulationId: string) => ["simulation-file", simulationId] as const,
  getAllActiveVehicles: (simulationId?: string) => ["active-vehicles", simulationId] as const,
  getFinalRoutes: (simulationId?: string, vehicleId?: number) =>
    ["final-routes", simulationId, vehicleId ?? null] as const,
};

export const simulationDetailQueries = {
  getAllCouriers: (
    api: AxiosInstance,
    simulationId?: string,
    onSuccess?: (data: TCourier[]) => void,
  ) => {
    return queryOptions({
      queryKey: SIMULATION_DETAIL_QUERY_KEYS.getAllActiveVehicles(simulationId),
      queryFn: async (): Promise<TCourier[]> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TCourier[]>> = await api.get(
          `/simulations/${simulationId}/couriers`,
        );

        const data = response.data.data;

        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      },
      enabled: !!simulationId,
    });
  },
  getFinalRoutes: (api: AxiosInstance, simulationId?: string, courierId?: number) => {
    return queryOptions({
      queryKey: SIMULATION_DETAIL_QUERY_KEYS.getFinalRoutes(simulationId, courierId),
      queryFn: async (): Promise<TLatestRouteBySimulationRow[]> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TLatestRouteBySimulationRow[]>> =
          await api.get(`/simulations/${simulationId}/routes`, {
            params: courierId ? { courierId } : undefined,
          });

        return response.data.data;
      },
      enabled: !!simulationId,
    });
  },
};
