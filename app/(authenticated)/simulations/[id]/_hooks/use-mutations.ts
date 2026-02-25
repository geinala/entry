"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { simulationDetailMutation } from "../_api/mutation";

export const useUploadCSVMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(simulationDetailMutation.uploadCSV(api, queryClient));
};
