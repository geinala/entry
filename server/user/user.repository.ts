"use server";

import { db } from "@/lib/db";
import { permissionTable, rolePermissionTable, roleTable, userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const findUserByClerkIdRepository = async (clerkUserId: string) => {
  return await db.select().from(userTable).where(eq(userTable.clerkUserId, clerkUserId)).limit(1);
};

export const findUserWithRoleAndPermissionsRepository = async (clerkUserId: string) => {
  return await db
    .select()
    .from(userTable)
    .innerJoin(roleTable, eq(userTable.roleId, roleTable.id))
    .leftJoin(rolePermissionTable, eq(roleTable.id, rolePermissionTable.roleId))
    .leftJoin(permissionTable, eq(rolePermissionTable.permissionId, permissionTable.id))
    .where(eq(userTable.clerkUserId, clerkUserId));
};
