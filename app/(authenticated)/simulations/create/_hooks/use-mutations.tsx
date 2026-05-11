import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSimulationJobMutations } from "../_api/mutations";

export const useCreateSimulationJobMutations = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(createSimulationJobMutations.createSimulationJob(api, queryClient));
};

export const useUpdateSimulationUploadedRowMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(createSimulationJobMutations.updateSimulationUploadedRow(api, queryClient));
};

export const useDeleteSimulationUploadedRowMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(createSimulationJobMutations.deleteSimulationUploadedRow(api, queryClient));
};

export const useUpdateSimulationJobMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(createSimulationJobMutations.updateSimulationJob(api, queryClient));
};

export const useDeleteAllSimulationUploadedErrorsAndContinueMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(
    createSimulationJobMutations.deleteAllSimulationUploadedErrorsAndContinue(api, queryClient),
  );
};
