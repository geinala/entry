import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DEPOT_MUTATIONS } from "../_api/mutations";

export const useDeleteDepotMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();

  return useMutation(DEPOT_MUTATIONS.delete(api, queryClient));
};
