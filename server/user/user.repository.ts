import "server-only";

import { db } from "@/lib/db";
import { userTable } from "@/drizzle/schema";
import { AnyColumn, eq, or, sql } from "drizzle-orm";
import { buildFilterClause, buildSortingClause, TFilterCriterion } from "@/lib/query";
import { PgColumn } from "drizzle-orm/pg-core";
import { calculateOffset } from "@/lib/pagination";
import { TGetUsersQueryParams } from "@/schemas/user.schema";

export const findCurrentUserByIdRepository = async (id: string) => {
  const [user] = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1);

  return user;
};

export const getUsersWithPaginationRepository = async (queryParams: TGetUsersQueryParams) => {
  const { page, pageSize, search, sort } = queryParams;
  const offset = calculateOffset(page, pageSize);

  const filters: TFilterCriterion[] = [
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

export const getUsersCountRepository = async (queryParams: TGetUsersQueryParams) => {
  const { search } = queryParams;
  const columns: Record<string, AnyColumn> = {
    fullName: userTable.fullName,
    email: userTable.email,
  };
  const filters: TFilterCriterion[] = [
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
