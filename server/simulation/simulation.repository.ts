import "server-only";

import { nodeTable, simulationTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { eq, sum } from "drizzle-orm";
import { TUpdateSimulation } from "@/types/database";

const SIMULATION_COLUMNS: TColumnsDefinition<typeof simulationTable> = {
  title: { searchable: true, sortable: true },
  status: { filterable: true },
  createdAt: { sortable: true },
  userId: { filterable: true },
};

export const getSimulationsWithPaginationRepository = async (
  userId: string,
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
  userId: string,
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
    .leftJoin(nodeTable, eq(simulationTable.id, nodeTable.simulationId))
    .limit(1);
};

export const updateSimulationRepository = async (simulationId: string, data: TUpdateSimulation) => {
  return await db
    .update(simulationTable)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(simulationTable.id, simulationId))
    .returning();
};

export const getAccumulatedSimulationNodeDemandRepository = async (simulationId: string) => {
  return await db
    .select({
      totalDemand: sum(nodeTable.demand),
    })
    .from(nodeTable)
    .where(eq(nodeTable.simulationId, simulationId));
};
