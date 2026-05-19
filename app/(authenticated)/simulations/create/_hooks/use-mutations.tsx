import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSimulationJobMutations } from "../_api/mutations";
import { useRouter } from "next/navigation";

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

export const useBulkDeleteSelectedErrorRowsMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(createSimulationJobMutations.bulkDeleteSelectedErrorRows(api, queryClient));
};

export const useBulkIgnoreSelectedErrorRowsMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(createSimulationJobMutations.bulkIgnoreSelectedErrorRows(api, queryClient));
};

export const useIgnoreAllErrorsAddressAndContinueMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(
    createSimulationJobMutations.ignoreAllErrorsAddressAndContinue(api, queryClient),
  );
};

export const useIgnoreAddressErrorRowMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(createSimulationJobMutations.ignoreAddressErrorRow(api, queryClient));
};

export const useStartOptimizationProcessMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    createSimulationJobMutations.startOptimizationProcess(api, queryClient, (redirectUrl) => {
      router.push(redirectUrl);
    }),
  );
};
