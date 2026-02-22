import { serverCheckPermissions } from "@/lib/permission";
import { getUserPermissionsByClerkUserId } from "./permission.repository";

export const checkUserPermissionsService = async (
  clerkUserId: string,
  requiredPermissions: string[],
) => {
  const userPermissions = await getUserPermissionsByClerkUserId(clerkUserId);

  return serverCheckPermissions(userPermissions, requiredPermissions);
};
