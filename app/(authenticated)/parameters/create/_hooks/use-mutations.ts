import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CREATE_PARAMETER_MUTATION } from "../_api/mutations";
import { useRouter } from "next/navigation";

export const useCreateParameterMutation = () => {
  const api = useAuthenticatedClient();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(CREATE_PARAMETER_MUTATION.create(api, queryClient, router));
};
