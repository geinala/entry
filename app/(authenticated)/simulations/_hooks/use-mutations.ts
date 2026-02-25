"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation } from "@tanstack/react-query";
import { simulationMutations } from "../_api/mutations";

export const useCreateSimulationMutation = () => {
  const api = useAuthenticatedClient();

  return useMutation(simulationMutations.createSimulation(api));
};
