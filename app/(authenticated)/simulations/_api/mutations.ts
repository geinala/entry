import { TCreateSimulationSchema } from "@/schemas/simulation.schema";
import { mutationOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const simulationMutations = {
  createSimulation: (api: AxiosInstance) => {
    return mutationOptions({
      mutationFn: async (payload: TCreateSimulationSchema) => {
        return await api.post("/simulations", payload);
      },
    });
  },
};
