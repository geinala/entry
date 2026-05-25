import {
  courierRouteTable,
  courierTable,
  reoptimizationEventTable,
  routeLegCongestionCheckTable,
  routeLegTable,
} from "@/drizzle/schema";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexQueryParams } from "@/types/query-params";
import { and, eq, getTableColumns, gt } from "drizzle-orm";

export const getReoptimizationEventsWithPaginationRepository = async (
  simulationId: string,
  queryParams: TIndexQueryParams,
) => {
  const REOPTIMIZATION_EVENTS_COLUMNS: TColumnsDefinition<typeof routeLegCongestionCheckTable> = {
    checkedAt: { sortable: true },
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
