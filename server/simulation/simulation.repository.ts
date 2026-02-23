import "server-only";

import { simulationTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TCreateSimulationSchema, TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { eq } from "drizzle-orm";

export const createSimulationRepository = async (userId: number, data: TCreateSimulationSchema) => {
  return await db
    .insert(simulationTable)
    .values({
      title: data.title,
      userId,
    })
    .returning();
};

const SIMULATION_COLUMNS: TColumnsDefinition<typeof simulationTable> = {
  title: { searchable: true, sortable: true },
  status: { filterable: true },
  createdAt: { sortable: true },
  userId: { filterable: true },
};

export const getSimulationsWithPaginationRepository = async (
  userId: number,
  queryParams: TIndexSimulationQueryParams,
) => {
  const modifiedQueryParams = {
    ...queryParams,
    userId,
  };

  return await buildPaginatedQuery({
    table: simulationTable,
    columns: SIMULATION_COLUMNS,
    queryParams: modifiedQueryParams,
  });
};

export const getSimulationsCountRepository = async (
  userId: number,
  queryParams: TIndexSimulationQueryParams,
) => {
  const modifiedQueryParams = {
    ...queryParams,
    userId,
  };

  return await buildCountQuery({
    table: simulationTable,
    columns: SIMULATION_COLUMNS,
    queryParams: modifiedQueryParams,
  });
};

export const getSimulationByIdRepository = async (simulationId: string) => {
  return await db
    .select()
    .from(simulationTable)
    .where(eq(simulationTable.id, simulationId))
    .limit(1);
};
