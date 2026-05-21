"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { simulationMutations } from "../_api/mutations";

export const useDeleteSimulationByIdMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(simulationMutations.deleteSimulationById(api, queryClient));
};
