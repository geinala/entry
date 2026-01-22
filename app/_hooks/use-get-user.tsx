"use client";

import { useQuery } from "@tanstack/react-query";
import useAuthenticatedClient from "./use-authenticated-client";
import { UserWithRoleAndPermissions } from "@/types/database";
import { isAxiosError } from "axios";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

export default function useGetUser() {
  const api = useAuthenticatedClient();
  const { signOut } = useClerk();

  return useQuery({
    queryKey: ["current-user"],
    queryFn: async (): Promise<UserWithRoleAndPermissions | null> => {
      try {
        return await api.get("/users/me");
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
