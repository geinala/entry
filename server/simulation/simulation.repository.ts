import "server-only";

import {
  nodeTable,
  simulationTable,
  simulationUploadedFileTable,
  vehicleTable,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import {
  TCreateSimulationConstraintsSchema,
  TIndexSimulationQueryParams,
} from "@/schemas/simulation.schema";
import { eq, sum } from "drizzle-orm";
import { TNewSimulationUploadedFile, TNewVehicle, TUpdateSimulation } from "@/types/database";

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

export const createSimulationUploadedFileRepository = async (data: TNewSimulationUploadedFile) => {
  return await db.insert(simulationUploadedFileTable).values(data).returning();
};

export const getSimulationUploadedFileBySimulationIdRepository = async (simulationId: string) => {
  return await db
    .select()
    .from(simulationTable)
    .innerJoin(
      simulationUploadedFileTable,
      eq(simulationTable.uploadId, simulationUploadedFileTable.id),
    )
    .where(eq(simulationTable.id, simulationId))
    .limit(1);
};

export const updateSimulationUploadedFileRepository = async (
  uploadedFileId: number,
  data: Partial<TNewSimulationUploadedFile>,
) => {
  return await db
    .update(simulationUploadedFileTable)
    .set(data)
    .where(eq(simulationUploadedFileTable.id, uploadedFileId))
    .returning();
};

const createSimulationVehiclesConstraintsRepository = async (
  simulationId: string,
  vehiclesConstraints: TCreateSimulationConstraintsSchema["vehiclesConstraints"],
) => {
  const insertData: Array<TNewVehicle> = vehiclesConstraints.map((constraint) => ({
    simulationId,
    maxCapacity: constraint.maxCapacity,
    name: constraint.vehicleName,
  }));

  await db.insert(vehicleTable).values(insertData);
};

export const createSimulationConstraintsRepository = async (
  simulationId: string,
  constraints: TCreateSimulationConstraintsSchema,
) => {
  return await Promise.all([
    updateSimulationRepository(simulationId, {
      computationTimeLimitInSeconds: constraints.computationTimeLimit,
    }),
    createSimulationVehiclesConstraintsRepository(simulationId, constraints.vehiclesConstraints),
  ]);
};

export const getAccumulatedSimulationNodeDemandRepository = async (simulationId: string) => {
  return await db
    .select({
      totalDemand: sum(nodeTable.demand),
    })
    .from(nodeTable)
    .where(eq(nodeTable.simulationId, simulationId));
};
