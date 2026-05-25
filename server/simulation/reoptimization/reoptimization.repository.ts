import {
  courierRouteTable,
  courierTable,
  reoptimizationEventTable,
  routeLegTable,
} from "@/drizzle/schema";
import { buildCountQuery, buildPaginatedQuery } from "@/lib/query-builder";
import { TIndexQueryParams } from "@/types/query-params";
import { eq, getTableColumns } from "drizzle-orm";

const REOPTIMIZATION_EVENTS_COLUMNS = {};

const REOPTIMIZATION_EVENTS_SELECT = {
  ...getTableColumns(reoptimizationEventTable),
  courierName: courierTable.name,
  fromNodeId: routeLegTable.fromNodeId,
  toNodeId: routeLegTable.toNodeId,
};

export const getReoptimizationEventsWithPaginationRepository = async (
  simulationId: string,
  queryParams: TIndexQueryParams,
) => {
  return await Promise.all([
    await buildPaginatedQuery({
      table: reoptimizationEventTable,
      columns: REOPTIMIZATION_EVENTS_COLUMNS,
      queryParams,
      select: REOPTIMIZATION_EVENTS_SELECT,
      baseConditions: [eq(reoptimizationEventTable.simulationId, simulationId)],
      applyJoins: (qb) => {
        return qb
          .innerJoin(
            courierRouteTable,
            eq(courierRouteTable.id, reoptimizationEventTable.courierRouteId),
          )
          .innerJoin(courierTable, eq(courierTable.id, courierRouteTable.courierId))
          .innerJoin(
            routeLegTable,
            eq(routeLegTable.id, reoptimizationEventTable.triggerRouteLegId),
          );
      },
    }),
    await buildCountQuery({
      table: reoptimizationEventTable,
      columns: REOPTIMIZATION_EVENTS_COLUMNS,
      queryParams,
      baseConditions: [eq(reoptimizationEventTable.simulationId, simulationId)],
      applyJoins: (qb) => {
        return qb
          .innerJoin(
            courierRouteTable,
            eq(courierRouteTable.id, reoptimizationEventTable.courierRouteId),
          )
          .innerJoin(courierTable, eq(courierTable.id, courierRouteTable.courierId))
          .innerJoin(
            routeLegTable,
            eq(routeLegTable.id, reoptimizationEventTable.triggerRouteLegId),
          );
      },
    }),
  ]);
};
