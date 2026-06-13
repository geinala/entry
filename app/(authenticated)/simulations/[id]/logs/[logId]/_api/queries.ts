import { TSimulationLogWithCourier } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

export const SIMULATION_LOG_QUERIES = {
  getSimulationLogById: ({
    api,
    simulationId,
    logId,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    logId?: string;
  }) => {
    return queryOptions({
      queryKey: ["simulation-log", simulationId, logId],
      queryFn: async (): Promise<TSimulationLogWithCourier> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TSimulationLogWithCourier>> =
          await api.get(`/simulations/${simulationId}/logs/${logId}`);
        return response.data.data;
      },
      enabled: !!simulationId && !!logId,
    });
  },
};
