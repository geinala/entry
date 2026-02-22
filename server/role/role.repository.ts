import { roleTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexRoleQueryParams } from "@/schemas/role.schema";
import { eq } from "drizzle-orm";

export const getRoleByNameRepository = async (name: string) => {
  return await db.select().from(roleTable).where(eq(roleTable.name, name)).limit(1);
};

const ROLE_COLUMNS: TColumnsDefinition<typeof roleTable> = {
  name: { searchable: true, sortable: true },
};

export const getRolesWithPaginationRepository = async (queryParams: TIndexRoleQueryParams) => {
  return await buildPaginatedQuery({
    table: roleTable,
    columns: ROLE_COLUMNS,
    queryParams,
  });
};

export const getRolesCountRepository = async (queryParams: TIndexRoleQueryParams) => {
  return await buildCountQuery({
    table: roleTable,
    columns: ROLE_COLUMNS,
    queryParams,
  });
};
