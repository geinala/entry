"use server";

import { db } from "@/lib/db";
import { permissionTable, rolePermissionTable, roleTable, userTable } from "@/drizzle/schema";
import { AnyColumn, eq, or, sql } from "drizzle-orm";
import { GetUsersQueryParamsType } from "./user.schema";
import { buildFilterClause, buildSortingClause, FilterCriterion } from "@/lib/query";
import { PgColumn } from "drizzle-orm/pg-core";

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

export const getUsersWithPaginationRepository = async (queryParams: GetUsersQueryParamsType) => {
  const { page, pageSize, search, sort } = queryParams;
  const offset = (page - 1) * pageSize;
  const filters: FilterCriterion[] = [
    { key: "email", operator: "ilike", value: search },
    {
      key: "fullName",
      operator: "ilike",
      value: search,
    },
  ];
  const sortableColumns: Record<string, PgColumn> = {
    fullName: userTable.fullName,
    email: userTable.email,
  } as const;
  const columns: Record<string, PgColumn> = {
    fullName: userTable.fullName,
    email: userTable.email,
  };

  const searchConditions = buildFilterClause({
    columns,
    filters,
  });

  const sortClause = buildSortingClause({ columns: sortableColumns, sort });

  const query = db
    .select()
    .from(userTable)
    .where(searchConditions.length ? or(...searchConditions) : undefined)
    .limit(pageSize)
    .offset(offset);

  if (sortClause && sortClause.length > 0) {
    query.orderBy(...sortClause);
  }

  const data = await query;

  return data;
};

export const getUsersCountRepository = async (queryParams: GetUsersQueryParamsType) => {
  const { search } = queryParams;
  const columns: Record<string, AnyColumn> = {
    fullName: userTable.fullName,
    email: userTable.email,
  };
  const filters: FilterCriterion[] = [
    { key: "email", operator: "ilike", value: search },
    {
      key: "fullName",
      operator: "ilike",
      value: search,
    },
  ];

  const searchConditions = buildFilterClause({
    columns,
    filters,
  });

  const result = await db
    .select({
      count: sql<number>`count(id)`,
    })
    .from(userTable)
    .where(searchConditions.length ? or(...searchConditions) : undefined);

  return result[0].count;
};
