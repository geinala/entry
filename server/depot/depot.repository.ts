import "server-only";

import { depotTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { asc, eq } from "drizzle-orm";
import { TIndexQueryParams } from "@/types/query-params";
import { TCreateOrUpdateDepotSchema } from "@/schemas/depot.schema";
import { TDepotOption } from "@/types/database";

const DEPOT_COLUMNS: TColumnsDefinition<typeof depotTable> = {
  name: { searchable: true },
  address: { searchable: true },
};

export const getDepotsWithPaginationRepository = async (queryParams: TIndexQueryParams) => {
  return await buildPaginatedQuery({
    table: depotTable,
    columns: DEPOT_COLUMNS,
    queryParams,
  });
};

export const getDepotsCountRepository = async (queryParams: TIndexQueryParams) => {
  return await buildCountQuery({
    table: depotTable,
    columns: DEPOT_COLUMNS,
    queryParams,
  });
};

export const getDepotOptionsRepository = async (): Promise<TDepotOption[]> => {
  return await db
    .select({
      id: depotTable.id,
      name: depotTable.name,
      address: depotTable.address,
      latitude: depotTable.latitude,
      longitude: depotTable.longitude,
    })
    .from(depotTable)
    .orderBy(asc(depotTable.name));
};

export const getDepotByIdRepository = async (id: number) => {
  const [depot] = await db.select().from(depotTable).where(eq(depotTable.id, id)).limit(1);

  return depot;
};

export const createDepotRepository = async (data: TCreateOrUpdateDepotSchema) => {
  const [depot] = await db.insert(depotTable).values(data).returning();

  return depot;
};

export const updateDepotRepository = async (id: number, data: TCreateOrUpdateDepotSchema) => {
  const [depot] = await db.update(depotTable).set(data).where(eq(depotTable.id, id)).returning();

  return depot;
};

export const deleteDepotRepository = async (id: number) => {
  const [depot] = await db.delete(depotTable).where(eq(depotTable.id, id)).returning();

  return depot;
};
