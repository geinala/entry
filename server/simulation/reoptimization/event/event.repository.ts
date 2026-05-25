import {
  courierRouteTable,
  nodeTable,
  reoptimizationEventTable,
  routeLegCongestionCheckTable,
  routeLegTable,
  trafficIncidentTable,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { aliasedTable, and, asc, eq, getTableColumns, inArray } from "drizzle-orm";
import type { TRouteSegmentWithBoundingBox } from "@/types/database";

const fromNodeTable = aliasedTable(nodeTable, "from_node");
const toNodeTable = aliasedTable(nodeTable, "to_node");

export const getRouteSegmentWithBoundingBoxRepository = async (
  simulationId: string,
  eventId: number,
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
    .from(reoptimizationEventTable)
    .where(
      and(
        eq(reoptimizationEventTable.simulationId, simulationId),
        eq(reoptimizationEventTable.id, eventId),
      ),
    )
    .innerJoin(routeLegTable, eq(reoptimizationEventTable.triggerRouteLegId, routeLegTable.id))
    .innerJoin(fromNodeTable, eq(routeLegTable.fromNodeId, fromNodeTable.id))
    .innerJoin(toNodeTable, eq(routeLegTable.toNodeId, toNodeTable.id))
    .innerJoin(
      routeLegCongestionCheckTable,
      eq(routeLegTable.id, routeLegCongestionCheckTable.routeLegId),
    )
    .leftJoin(
      trafficIncidentTable,
      and(
        eq(routeLegCongestionCheckTable.accepted_incident_id, trafficIncidentTable.id),
        eq(trafficIncidentTable.simulationId, simulationId),
      ),
    );

  return result;
};

export const getRouteSegmentCongestionCheckMatchDetailsRepository = async (
  simulationId: string,
  eventId: number,
) => {
  const [result] = await db
    .select({
      matchDetails: routeLegCongestionCheckTable.matchDetails,
    })
    .from(reoptimizationEventTable)
    .where(
      and(
        eq(reoptimizationEventTable.simulationId, simulationId),
        eq(reoptimizationEventTable.id, eventId),
      ),
    )
    .innerJoin(routeLegTable, eq(reoptimizationEventTable.triggerRouteLegId, routeLegTable.id))
    .innerJoin(
      routeLegCongestionCheckTable,
      eq(routeLegTable.id, routeLegCongestionCheckTable.routeLegId),
    )
    .limit(1);

  return result?.matchDetails;
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
  eventId: number,
) => {
  const [result] = await db
    .select({
      beforeRoute: beforeRouteLegTable,
      afterRoute: afterRouteLegTable,
      timeSavedInSeconds: reoptimizationEventTable.timeSavedInSeconds,
    })
    .from(reoptimizationEventTable)
    .where(
      and(
        eq(reoptimizationEventTable.simulationId, simulationId),
        eq(reoptimizationEventTable.id, eventId),
      ),
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

  return result;
};

export const getFullRouteComparisonRepository = async (simulationId: string, eventId: number) => {
  const [event] = await db
    .select({
      ...getTableColumns(reoptimizationEventTable),
    })
    .from(reoptimizationEventTable)
    .where(
      and(
        eq(reoptimizationEventTable.simulationId, simulationId),
        eq(reoptimizationEventTable.id, eventId),
      ),
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
