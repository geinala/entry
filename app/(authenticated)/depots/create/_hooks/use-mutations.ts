import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CREATE_DEPOT_MUTATION } from "../_api/mutations";
import { useRouter } from "next/navigation";

export const useCreateDepotMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(CREATE_DEPOT_MUTATION.create(api, queryClient, router));
};
