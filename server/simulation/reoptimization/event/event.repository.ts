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
  const rows = await db
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
    )
    .where(
      and(
        eq(routeLegCongestionCheckIncidentTable.congestionCheckId, congestionCheckId),
        eq(routeLegCongestionCheckTable.simulationId, simulationId),
        eq(routeLegCongestionCheckIncidentTable.isValidCongestion, true),
      ),
    );

  if (!rows.length) {
    return undefined;
  }

  return {
    routeSegmentPolyline: rows[0].routeSegmentPolyline,
    fromNode: rows[0].fromNode,
    toNode: rows[0].toNode,
    bboxMinLat: rows[0].bboxMinLat,
    bboxMinLon: rows[0].bboxMinLon,
    bboxMaxLat: rows[0].bboxMaxLat,
    bboxMaxLon: rows[0].bboxMaxLon,

    acceptedIncidents: rows.map((r) => r.acceptedIncident),
  };
};

export const getRouteSegmentCongestionCheckMatchDetailsRepository = async (
  congestionCheckId: number,
) => {
  return await db
    .select()
    .from(routeLegCongestionCheckIncidentTable)
    .where(eq(routeLegCongestionCheckIncidentTable.congestionCheckId, congestionCheckId))
    .innerJoin(
      trafficIncidentTable,
      eq(trafficIncidentTable.id, routeLegCongestionCheckIncidentTable.trafficIncidentId),
    );
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

  return result;
};

export const getFullRouteComparisonRepository = async (simulationId: string, eventId: number) => {
  const [event] = await db
    .select({
      courierId: routeLegCongestionCheckTable.courierId,
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

  if (!event?.beforeRouteId || !event?.afterRouteId || !event?.courierId) {
    return undefined;
  }

  const [beforeRouteLegs, afterRouteLegs] = await Promise.all([
    db
      .select({ ...getTableColumns(routeLegTable) })
      .from(routeLegTable)
      .where(eq(routeLegTable.courierRouteId, event.beforeRouteId))
      .orderBy(asc(routeLegTable.sequence)),

    db
      .select({ ...getTableColumns(routeLegTable) })
      .from(routeLegTable)
      .where(eq(routeLegTable.courierRouteId, event.afterRouteId))
      .orderBy(asc(routeLegTable.sequence)),
  ]);

  let inheritedCompletedLegs: typeof beforeRouteLegs = [];
  const firstAfterLeg = afterRouteLegs[0];

  if (firstAfterLeg) {
    let splitIndex = -1;
    for (let i = beforeRouteLegs.length - 1; i >= 0; i--) {
      const leg = beforeRouteLegs[i];
      if (leg.routeStatus === "completed" && leg.toNodeId === firstAfterLeg.fromNodeId) {
        splitIndex = i;
        break;
      }
    }

    if (splitIndex !== -1) {
      inheritedCompletedLegs = beforeRouteLegs.slice(0, splitIndex + 1);
    } else if (
      beforeRouteLegs.length > 0 &&
      firstAfterLeg.fromNodeId === beforeRouteLegs[0].fromNodeId
    ) {
      inheritedCompletedLegs = [];
    } else {
      inheritedCompletedLegs = beforeRouteLegs.filter(
        (leg) => leg.sequence < firstAfterLeg.sequence && leg.routeStatus === "completed",
      );
    }
  }

  const sortBySequence = <T extends { sequence: number }>(arr: T[]) =>
    arr.sort((a, b) => a.sequence - b.sequence);

  return {
    ...event,
    beforeRoute: sortBySequence([...beforeRouteLegs]),
    afterRoute: sortBySequence([...inheritedCompletedLegs, ...afterRouteLegs]),
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
