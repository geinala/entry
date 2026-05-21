"use client";

import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "sonner";
import { SIMULATIONS_QUERY_KEYS } from "./queries";
import { TBaseApiResponse } from "@/types/response";
import { TUpdateSimulationJobSchema } from "@/schemas/simulations/jobs/update-simulation-job.schema";

export const simulationMutations = {
  deleteDraftSimulationJob: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (): Promise<TBaseApiResponse> => {
        /* eslint-disable drizzle/enforce-delete-with-where */
        const response: AxiosResponse<TBaseApiResponse> =
          await api.delete("/simulations/jobs/draft");

        return response.data;
      },
      onSuccess: (data: TBaseApiResponse) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
  updateSimulationJob: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async ({ id, payload }: { id: string; payload: TUpdateSimulationJobSchema }) => {
        const response: AxiosResponse<TBaseApiResponse> = await api.patch(
          `/simulations/jobs/${id}`,
          payload,
        );

        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
        queryClient.invalidateQueries({ queryKey: ["simulations"] as const });
      },
    });
  },
  deleteSimulationById: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (simulationId: string): Promise<TBaseApiResponse> => {
        const response: AxiosResponse<TBaseApiResponse> = await api.delete(
          `/simulations/${simulationId}`,
        );

        return response.data;
      },
      onSuccess: (data, simulationId) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: SIMULATIONS_QUERY_KEYS.all });
        queryClient.removeQueries({ queryKey: SIMULATIONS_QUERY_KEYS.findById(simulationId) });
      },
    });
  },
};
