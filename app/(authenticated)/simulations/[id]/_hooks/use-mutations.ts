import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation } from "@tanstack/react-query";
import { simulationDetailMutation } from "../_api/mutation";

export const useUploadCSVMutation = () => {
  const api = useAuthenticatedClient();

  return useMutation(simulationDetailMutation.uploadCSV(api));
};
