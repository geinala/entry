import { eq } from "drizzle-orm";
import { permissionTable, rolePermissionTable, roleTable, userTable } from "@/drizzle/schema";
import { db } from "@/lib/db";

export const getUserPermissionsByClerkUserId = async (clerkUserId: string) => {
  const permissions = await db
    .select({
      id: permissionTable.id,
      name: permissionTable.name,
      description: permissionTable.description,
    })
    .from(userTable)
    .innerJoin(roleTable, eq(userTable.roleId, roleTable.id))
    .innerJoin(rolePermissionTable, eq(roleTable.id, rolePermissionTable.roleId))
    .innerJoin(permissionTable, eq(rolePermissionTable.permissionId, permissionTable.id))
    .where(eq(userTable.clerkUserId, clerkUserId));

  return permissions.map((p) => p.name);
};
