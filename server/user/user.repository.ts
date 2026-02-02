"use server";

import { db } from "@/lib/db";
import { permissionTable, rolePermissionTable, roleTable, userTable } from "@/drizzle/schema";
import { and, eq, ilike, sql } from "drizzle-orm";
import { IndexQueryParamsType } from "@/types/query-params";

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

export const getUsersWithPaginationRepository = async (queryParams: IndexQueryParamsType) => {
  const { page, pageSize, search } = queryParams;

  const offset = (page - 1) * pageSize;

  const conditions = [];

  if (search) {
    conditions.push(ilike(userTable.email, `%${search}%`));
  }

  const data = await db
    .select()
    .from(userTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(pageSize)
    .offset(offset);

  return data;
};

export const getUsersCountRepository = async (queryParams: IndexQueryParamsType) => {
  const { search } = queryParams;

  const conditions = [];

  if (search) {
    conditions.push(ilike(userTable.email, `%${search}%`));
  }

  const result = await db
    .select({
      count: sql<number>`count(id)`,
    })
    .from(userTable)
    .where(conditions.length ? and(...conditions) : undefined);

  return result[0].count;
};
