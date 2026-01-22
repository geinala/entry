import { RoleEnum } from "@/common/enum/role";

export const isAdmin = (roleName: string | undefined) => {
  return roleName === RoleEnum.ADMIN;
};
