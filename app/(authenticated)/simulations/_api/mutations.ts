"use client";

import { TCreateSimulationSchema } from "@/schemas/simulation.schema";
import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "sonner";
import { SIMULATIONS_QUERY_KEYS } from "./queries";
import { TBaseApiResponse } from "@/types/response";

export const simulationMutations = {
  createSimulation: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (payload: TCreateSimulationSchema) => {
        return await api.post("/simulations", payload);
      },
      onSuccess: () => {
        toast.success("Simulation created successfully");

        queryClient.invalidateQueries({ queryKey: SIMULATIONS_QUERY_KEYS.all });
      },
    });
  },
  deleteDraftSimulationJob: (api: AxiosInstance) => {
    return mutationOptions({
      mutationFn: async (): Promise<TBaseApiResponse> => {
        /* eslint-disable drizzle/enforce-delete-with-where */
        const response: AxiosResponse<TBaseApiResponse> = await api.delete("/simulations/draft");

        return response.data;
      },
      onSuccess: (data: TBaseApiResponse) => {
        toast.success(data.message);
      },
    });
  },
};
