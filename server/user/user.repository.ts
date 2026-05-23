import "server-only";

import { db } from "@/lib/db";
import { userTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { TUserIndexQueryParams } from "@/schemas/user.schema";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";

export const findCurrentUserByIdRepository = async (id: string) => {
  const [user] = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1);

  return user;
};

const USER_COLUMNS: TColumnsDefinition<typeof userTable> = {
  fullName: { searchable: true, sortable: false, filterable: false },
  email: { searchable: true, sortable: false, filterable: false },
};

export const getUsersWithPaginationRepository = async (queryParams: TUserIndexQueryParams) => {
  return await Promise.all([
    await buildPaginatedQuery({
      table: userTable,
      columns: USER_COLUMNS,
      queryParams,
    }),
    await buildCountQuery({
      table: userTable,
      columns: USER_COLUMNS,
      queryParams,
    }),
  ]);
};
