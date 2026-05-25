import {
  courierRouteTable,
  nodeTable,
  reoptimizationEventTable,
  routeLegCongestionCheckIncidentTable,
  routeLegCongestionCheckTable,
  routeLegTable,
  trafficIncidentTable,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { aliasedTable, and, asc, eq, getTableColumns, gt, inArray } from "drizzle-orm";
import type { TRouteSegmentWithBoundingBox } from "@/types/database";

const fromNodeTable = aliasedTable(nodeTable, "from_node");
const toNodeTable = aliasedTable(nodeTable, "to_node");

export const getRouteSegmentWithBoundingBoxRepository = async (
  simulationId: string,
  congestionCheckId: number,
): Promise<TRouteSegmentWithBoundingBox | undefined> => {
  const [result] = await db
    .select({
      routeSegmentPolyline: routeLegTable.encodedPolyline,
      fromNode: fromNodeTable,
      toNode: toNodeTable,
      bboxMinLat: routeLegCongestionCheckTable.bboxMinLat,
      bboxMinLon: routeLegCongestionCheckTable.bboxMinLng,
      bboxMaxLat: routeLegCongestionCheckTable.bboxMaxLat,
      bboxMaxLon: routeLegCongestionCheckTable.bboxMaxLng,
      acceptedIncident: getTableColumns(trafficIncidentTable),
    })
    .from(routeLegCongestionCheckIncidentTable)
    .where(
      and(
        eq(routeLegCongestionCheckIncidentTable.congestionCheckId, congestionCheckId),
        eq(routeLegCongestionCheckTable.simulationId, simulationId),
      ),
    )
    .innerJoin(
      routeLegCongestionCheckTable,
      eq(routeLegCongestionCheckTable.id, routeLegCongestionCheckIncidentTable.congestionCheckId),
    )
    .innerJoin(routeLegTable, eq(routeLegTable.id, routeLegCongestionCheckTable.routeLegId))
    .innerJoin(fromNodeTable, eq(routeLegTable.fromNodeId, fromNodeTable.id))
    .innerJoin(toNodeTable, eq(routeLegTable.toNodeId, toNodeTable.id))
    .innerJoin(
      trafficIncidentTable,
      eq(trafficIncidentTable.id, routeLegCongestionCheckIncidentTable.trafficIncidentId),
    );

  return result;
};

export const getRouteSegmentCongestionCheckMatchDetailsRepository = async (
  congestionCheckId: number,
) => {
  return await db
    .select()
    .from(routeLegCongestionCheckIncidentTable)
    .where(eq(routeLegCongestionCheckIncidentTable.congestionCheckId, congestionCheckId));
};

export const getIncidentRouteSegmentByTomTomIdsRepository = async (
  simulationId: string,
  tomTomSegmentIds: string[],
) => {
  const results = await db
    .select()
    .from(trafficIncidentTable)
    .where(
      and(
        eq(trafficIncidentTable.simulationId, simulationId),
        inArray(trafficIncidentTable.tomtomIncidentId, tomTomSegmentIds),
      ),
    );

  return results;
};

const beforeCourierRouteTable = aliasedTable(courierRouteTable, "before_courier_route");
const afterCourierRouteTable = aliasedTable(courierRouteTable, "after_courier_route");

const beforeRouteLegTable = aliasedTable(routeLegTable, "before_route_leg");
const afterRouteLegTable = aliasedTable(routeLegTable, "after_route_leg");
const triggeredRouteLegTable = aliasedTable(routeLegTable, "triggered_route_leg");

export const getRouteSegmentAffectedIncidentsRepository = async (
  simulationId: string,
  congestionCheckId: number,
) => {
  const [result] = await db
    .select({
      beforeRoute: beforeRouteLegTable,
      afterRoute: afterRouteLegTable,
      timeSavedInSeconds: reoptimizationEventTable.timeSavedInSeconds,
    })
    .from(routeLegCongestionCheckTable)
    .where(
      and(
        eq(routeLegCongestionCheckTable.simulationId, simulationId),
        eq(routeLegCongestionCheckTable.id, congestionCheckId),
      ),
    )
    .leftJoin(
      reoptimizationEventTable,
      eq(reoptimizationEventTable.congestionCheckId, routeLegCongestionCheckTable.id),
    )
    .innerJoin(
      triggeredRouteLegTable,
      eq(triggeredRouteLegTable.id, reoptimizationEventTable.triggerRouteLegId),
    )
    .innerJoin(
      beforeCourierRouteTable,
      eq(beforeCourierRouteTable.id, reoptimizationEventTable.beforeRouteId),
    )
    .innerJoin(
      afterCourierRouteTable,
      eq(afterCourierRouteTable.id, reoptimizationEventTable.afterRouteId),
    )
    .innerJoin(
      beforeRouteLegTable,
      and(
        eq(beforeRouteLegTable.courierRouteId, beforeCourierRouteTable.id),
        eq(beforeRouteLegTable.fromNodeId, triggeredRouteLegTable.fromNodeId),
      ),
    )
    .innerJoin(
      afterRouteLegTable,
      and(
        eq(afterRouteLegTable.courierRouteId, afterCourierRouteTable.id),
        eq(afterRouteLegTable.fromNodeId, triggeredRouteLegTable.fromNodeId),
      ),
    );

  console.log("getRouteSegmentAffectedIncidentsRepository result:", { result });

  return result;
};

export const getFullRouteComparisonRepository = async (simulationId: string, eventId: number) => {
  const [event] = await db
    .select({
      ...getTableColumns(reoptimizationEventTable),
    })
    .from(routeLegCongestionCheckTable)
    .where(
      and(
        eq(routeLegCongestionCheckTable.simulationId, simulationId),
        eq(routeLegCongestionCheckTable.id, eventId),
      ),
    )
    .leftJoin(
      reoptimizationEventTable,
      eq(reoptimizationEventTable.congestionCheckId, routeLegCongestionCheckTable.id),
    )
    .limit(1);

  if (!event) {
    return undefined;
  }

  if (event.beforeRouteId == null || event.afterRouteId == null) {
    return undefined;
  }

  const [beforeRoute, afterRoute] = await Promise.all([
    db
      .select()
      .from(beforeRouteLegTable)
      .where(eq(beforeRouteLegTable.courierRouteId, event.beforeRouteId))
      .orderBy(asc(beforeRouteLegTable.sequence)),
    db
      .select()
      .from(afterRouteLegTable)
      .where(eq(afterRouteLegTable.courierRouteId, event.afterRouteId))
      .orderBy(asc(afterRouteLegTable.sequence)),
  ]);

  return {
    ...event,
    beforeRoute,
    afterRoute,
  };
};

export const hasIncidentsRepository = async (congestionCheckId: number) => {
  return await db
    .select()
    .from(routeLegCongestionCheckTable)
    .where(
      and(
        eq(routeLegCongestionCheckTable.id, congestionCheckId),
        gt(routeLegCongestionCheckTable.incidentsFound, 0),
      ),
    );
};
