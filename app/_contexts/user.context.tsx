"use client";

import { TUserWithRoleAndPermissions } from "@/types/database";
import { createContext, useContext, useMemo } from "react";
import useGetUser from "../_hooks/use-get-user";
import Loading from "../_components/loading";
import { ROLE_ENUM } from "@/common/enum/role";

const UserContext = createContext<{
  userDetails: TUserWithRoleAndPermissions | null;
  isAdmin: boolean;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useGetUser();

  const contextValue = useMemo(
    () => ({
      userDetails: data || null,
      isAdmin: data?.role?.name === ROLE_ENUM.ADMIN,
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
