import {
  courierRouteTable,
  courierTable,
  reoptimizationEventTable,
  routeLegCongestionCheckTable,
  routeLegTable,
} from "@/drizzle/schema";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TReoptimizationEventTableIndexQueryParams } from "@/schemas/simulations/reoptimization-event.schema";
import { and, eq, getTableColumns, gt, sql } from "drizzle-orm";

export const getReoptimizationEventsWithPaginationRepository = async (
  simulationId: string,
  queryParams: TReoptimizationEventTableIndexQueryParams,
) => {
  const REOPTIMIZATION_EVENTS_COLUMNS: TColumnsDefinition<typeof routeLegCongestionCheckTable> = {
    checkedAt: { sortable: true },
    ...(queryParams.courierId && { courierId: { filterable: true } }),
  };

  return await Promise.all([
    await buildPaginatedQuery({
      table: routeLegCongestionCheckTable,
      columns: REOPTIMIZATION_EVENTS_COLUMNS,
      queryParams,
      select: {
        ...getTableColumns(reoptimizationEventTable),
        ...getTableColumns(routeLegCongestionCheckTable),
        courierName: courierTable.name,
        fromNodeId: routeLegTable.fromNodeId,
        toNodeId: routeLegTable.toNodeId,
        isBaseline: sql<boolean>`
            CASE
              WHEN ${courierRouteTable.isActive} = false
              THEN true
              ELSE false
            END
          `.as("isBaseline"),
      },
      baseConditions: [
        and(
          eq(routeLegCongestionCheckTable.simulationId, simulationId),
          gt(routeLegCongestionCheckTable.incidentsFound, 0),
        ),
      ],
      applyJoins: (qb) => {
        return qb
          .innerJoin(routeLegTable, eq(routeLegTable.id, routeLegCongestionCheckTable.routeLegId))
          .innerJoin(courierRouteTable, eq(courierRouteTable.id, routeLegTable.courierRouteId))
          .innerJoin(courierTable, eq(courierTable.id, courierRouteTable.courierId))
          .leftJoin(
            reoptimizationEventTable,
            eq(reoptimizationEventTable.congestionCheckId, routeLegCongestionCheckTable.id),
          );
      },
    }),
    await buildCountQuery({
      table: routeLegCongestionCheckTable,
      columns: REOPTIMIZATION_EVENTS_COLUMNS,
      queryParams,
      baseConditions: [
        and(
          eq(routeLegCongestionCheckTable.simulationId, simulationId),
          gt(routeLegCongestionCheckTable.incidentsFound, 0),
        ),
      ],
      applyJoins: (qb) => {
        return qb
          .innerJoin(routeLegTable, eq(routeLegTable.id, routeLegCongestionCheckTable.routeLegId))
          .innerJoin(courierRouteTable, eq(courierRouteTable.id, routeLegTable.courierRouteId))
          .innerJoin(courierTable, eq(courierTable.id, courierRouteTable.courierId))
          .leftJoin(
            reoptimizationEventTable,
            eq(reoptimizationEventTable.congestionCheckId, routeLegCongestionCheckTable.id),
          );
      },
    }),
  ]);
};
