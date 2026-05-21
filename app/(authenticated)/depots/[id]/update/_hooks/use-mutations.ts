import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { UPDATE_DEPOT_MUTATIONS } from "../_api/mutations";

export const useUpdateDepotMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(UPDATE_DEPOT_MUTATIONS.update(api, queryClient, router));
};
