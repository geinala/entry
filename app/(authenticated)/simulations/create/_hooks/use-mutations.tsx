import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSimulationJobMutations } from "../_api/mutations";

export const useCreateSimulationJobMutations = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(createSimulationJobMutations.createSimulationJob(api, queryClient));
};
