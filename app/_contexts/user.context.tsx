import { UserWithRoleAndPermissions } from "@/types/database";
import { useClerk } from "@clerk/nextjs";
import { createContext, useContext } from "react";
import useGetUser from "../_hooks/use-get-user";
import Loading from "../_components/loading";
import { RoleEnum } from "@/common/enum/role";

const UserContext = createContext<{
  userDetails: UserWithRoleAndPermissions | null;
  isAdmin: boolean;
  clerkUser: ReturnType<typeof useClerk>;
} | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const clerkUser = useClerk();
  const { data, isLoading } = useGetUser();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <UserContext.Provider
      value={{
        userDetails: data || null,
        clerkUser,
        isAdmin: data?.role?.name === RoleEnum.ADMIN,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used inside UserProvider");
  return ctx;
}
