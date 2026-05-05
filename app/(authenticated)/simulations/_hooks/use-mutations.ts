"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { simulationMutations } from "../_api/mutations";

export const useCreateSimulationMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(simulationMutations.createSimulation(api, queryClient));
};

export const useDeleteDraftSimulationJobMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(simulationMutations.deleteDraftSimulationJob(api, queryClient));
};

export const useUpdateSimulationJobMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(simulationMutations.updateSimulationJob(api, queryClient));
};
