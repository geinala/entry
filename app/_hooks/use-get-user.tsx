"use client";

import { useQuery } from "@tanstack/react-query";
import useAuthenticatedClient from "./use-authenticated-client";
import { TUser } from "@/types/database";
import { AxiosResponse } from "axios";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { TApiSuccessResponseWithData } from "@/types/response";

export default function useGetCurrentUser() {
  const api = useAuthenticatedClient();
  const { signOut } = useClerk();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async (): Promise<TUser> => {
      try {
        const response: AxiosResponse<TApiSuccessResponseWithData<TUser>> =
          await api.get("/users/me");

        return response.data.data;
      } catch (error) {
        toast.error("Failed to fetch user details. Please sign in again.");
        await signOut({ redirectUrl: `/sign-in?callbackUrl=${window.location.pathname}` });
        throw error;
      }
    },
  });
}
