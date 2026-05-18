"use client";

import { useQuery } from "@tanstack/react-query";
import useAuthenticatedClient from "./use-authenticated-client";
import { TUserWithRoleAndPermissionNames } from "@/types/database";
import { AxiosResponse, isAxiosError } from "axios";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { TApiSuccessResponseWithData } from "@/types/response";

export default function useGetUser() {
  const api = useAuthenticatedClient();
  const { signOut } = useClerk();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async (): Promise<TUserWithRoleAndPermissionNames | null> => {
      try {
        const response: AxiosResponse<
          TApiSuccessResponseWithData<TUserWithRoleAndPermissionNames>
        > = await api.get("/users/me");

        return response.data.data;
      } catch (error) {
        if (isAxiosError(error) && error.status === 401) {
          toast.error("Session expired. Please sign in again.");
          await signOut({ redirectUrl: `/sign-in?callbackUrl=${window.location.pathname}` });
          return null;
        }
        throw error;
      }
    },
  });
}
