import "server-only";

import {
  courierRouteTable,
  courierTable,
  matrixBatchTable,
  matrixResultTable,
  nodeDetailTable,
  nodeTable,
  optimizationRunTable,
  routeLegTable,
  simulationLogTable,
  simulationTable,
  solutionTable,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { and, eq, inArray, sum } from "drizzle-orm";
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

export const deleteSimulationWithRelationsRepository = async (
  simulationId: string,
  userId: string,
) => {
  return await db.transaction(async (tx) => {
    const [simulation] = await tx
      .select({ id: simulationTable.id })
      .from(simulationTable)
      .where(and(eq(simulationTable.id, simulationId), eq(simulationTable.userId, userId)))
      .limit(1);

    if (!simulation) {
      return null;
    }

    const couriers = await tx
      .select({ id: courierTable.id })
      .from(courierTable)
      .where(eq(courierTable.simulationId, simulationId));
    const courierIds = couriers.map((courier) => courier.id);

    const solutions = await tx
      .select({ id: solutionTable.id })
      .from(solutionTable)
      .where(eq(solutionTable.simulationId, simulationId));
    const solutionIds = solutions.map((solution) => solution.id);

    const nodes = await tx
      .select({ id: nodeTable.id })
      .from(nodeTable)
      .where(eq(nodeTable.simulationId, simulationId));
    const nodeIds = nodes.map((node) => node.id);

    const matrixBatches = await tx
      .select({ id: matrixBatchTable.id })
      .from(matrixBatchTable)
      .where(eq(matrixBatchTable.simulationId, simulationId));
    const matrixBatchIds = matrixBatches.map((batch) => batch.id);

    const routeIds =
      courierIds.length > 0
        ? (
            await tx
              .select({ id: courierRouteTable.id })
              .from(courierRouteTable)
              .where(inArray(courierRouteTable.courierId, courierIds))
          ).map((route) => route.id)
        : [];

    await tx.delete(optimizationRunTable).where(eq(optimizationRunTable.simulationId, simulationId));
    await tx.delete(simulationLogTable).where(eq(simulationLogTable.simulationId, simulationId));

    if (matrixBatchIds.length > 0) {
      await tx.delete(matrixResultTable).where(inArray(matrixResultTable.matrixBatchId, matrixBatchIds));
    }

    await tx.delete(matrixResultTable).where(eq(matrixResultTable.simulationId, simulationId));
    await tx.delete(matrixBatchTable).where(eq(matrixBatchTable.simulationId, simulationId));

    if (routeIds.length > 0) {
      await tx.delete(routeLegTable).where(inArray(routeLegTable.courierRouteId, routeIds));
      await tx
        .update(courierRouteTable)
        .set({ reoptimizedFromRouteId: null })
        .where(inArray(courierRouteTable.id, routeIds));
      await tx.delete(courierRouteTable).where(inArray(courierRouteTable.id, routeIds));
    }

    await tx.delete(solutionTable).where(eq(solutionTable.simulationId, simulationId));

    if (nodeIds.length > 0) {
      await tx.delete(nodeDetailTable).where(inArray(nodeDetailTable.nodeId, nodeIds));
    }

    await tx.delete(nodeTable).where(eq(nodeTable.simulationId, simulationId));
    await tx.delete(courierTable).where(eq(courierTable.simulationId, simulationId));

    const [deletedSimulation] = await tx
      .delete(simulationTable)
      .where(and(eq(simulationTable.id, simulationId), eq(simulationTable.userId, userId)))
      .returning();

    return deletedSimulation;
  });
};
