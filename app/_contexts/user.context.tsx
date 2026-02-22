"use client";

import { TUserWithRoleAndPermissionNames } from "@/types/database";
import { createContext, useContext, useMemo } from "react";
import useGetUser from "../_hooks/use-get-user";
import Loading from "../_components/loading";

const UserContext = createContext<{
  userDetails: TUserWithRoleAndPermissionNames | null;
  permissions?: string[];
  role?: string;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useGetUser();

  const contextValue = useMemo(
    () => ({
      userDetails: data || null,
      permissions: data?.permissions || [],
      role: data?.role,
    }),
    [data],
  );

  if (isLoading) {
    return <Loading />;
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used inside UserProvider");
  return ctx;
}
