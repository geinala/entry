"use client";

import { TCreateSimulationConstraintsSchema } from "@/schemas/simulation.schema";
import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { toast } from "sonner";

export const simulationDetailMutation = {
  uploadCSV: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async ({
        formData,
        simulationId,
      }: {
        formData: FormData;
        simulationId: string;
      }) => {
        return await api.post(`/simulations/${simulationId}/files`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      },
      onSuccess: () => {
        toast.success("CSV file uploaded successfully!");
        queryClient.invalidateQueries({ queryKey: ["simulation-file"] });
        queryClient.invalidateQueries({ queryKey: ["simulations"] });
      },
      onError: () => {
        toast.error("Failed to upload CSV file. Please try again.");
      },
    });
  },
  startSimulation: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async ({
        simulationId,
        constraintsData,
      }: {
        simulationId: string;
        constraintsData: TCreateSimulationConstraintsSchema;
      }) => {
        return await api.post(`/simulations/${simulationId}`, constraintsData);
      },
      onSuccess: () => {
        toast.success("Constraints saved successfully!");
        queryClient.invalidateQueries({ queryKey: ["simulation-constraints"] });
        queryClient.invalidateQueries({ queryKey: ["simulations"] });
      },
    });
  },
};
