"use client";

import { UserWithRoleAndPermissions } from "@/types/database";
import { createContext, useContext, useMemo } from "react";
import useGetUser from "../_hooks/use-get-user";
import Loading from "../_components/loading";
import { RoleEnum } from "@/common/enum/role";

const UserContext = createContext<{
  userDetails: UserWithRoleAndPermissions | null;
  isAdmin: boolean;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useGetUser();

  const contextValue = useMemo(
    () => ({
      userDetails: data || null,
      isAdmin: data?.role?.name === RoleEnum.ADMIN,
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
