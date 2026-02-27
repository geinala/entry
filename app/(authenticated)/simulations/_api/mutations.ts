"use client";

import { TCreateSimulationSchema } from "@/schemas/simulation.schema";
import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { toast } from "sonner";
import { SIMULATIONS_QUERY_KEYS } from "./queries";

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
};
