import { decodePolyline } from "@/lib/utils";
import { TLatestRouteBySimulationRow } from "@/types/database";
import { TCoordinate } from "@/types/route";

export type DecodedRoute = {
  id: string;
  courierId: string;
  sequence: number;
  travelTimeMs: number;
  routeStatus: TLatestRouteBySimulationRow["route_status"];
  coordinates: TCoordinate[];
};

export type RouteNode = {
  lat: number;
  lng: number;
  sequence: number;
  isOrigin: boolean;
  isDestination: boolean;
  visitState: RouteNodeVisitState;
};

export type RouteNodeVisitState = "visited" | "running-origin" | "running-destination" | "pending";

const ROUTE_STATUS_PRIORITY: Record<TLatestRouteBySimulationRow["route_status"], number> = {
  planned: 0,
  completed: 1,
  cancelled: 2,
  running: 3,
};

const ROUTE_NODE_STYLE: Record<RouteNodeVisitState, { borderColor: string; textColor: string }> = {
  visited: {
    borderColor: "#22c55e",
    textColor: "#15803d",
  },
  "running-origin": {
    borderColor: "#22c55e",
    textColor: "#15803d",
  },
  "running-destination": {
    borderColor: "#ef4444",
    textColor: "#b91c1c",
  },
  pending: {
    borderColor: "#94a3b8",
    textColor: "#64748b",
  },
};

const getNodeVisitState = (
  routeStatus: TLatestRouteBySimulationRow["route_status"],
  isOrigin: boolean,
): RouteNodeVisitState => {
  if (routeStatus === "completed") {
    return "visited";
  }

  if (routeStatus === "running") {
    return isOrigin ? "running-origin" : "running-destination";
  }

  return "pending";
};

export const getRouteNodeStyle = (visitState: RouteNodeVisitState) => {
  return ROUTE_NODE_STYLE[visitState];
};

export const decodeRoutes = (routes: TLatestRouteBySimulationRow[]): DecodedRoute[] => {
  return routes
    .map((route) => {
      const coordinates = decodePolyline(
        route.encoded_polyline,
        route.encoded_polyline_precision ?? 5,
      );

      return {
        id: String(route.id),
        courierId: String(route.courier.id),
        sequence: route.sequence,
        travelTimeMs: route.travel_time_in_seconds * 1000,
        routeStatus: route.route_status,
        coordinates,
      };
    })
    .filter((route) => route.coordinates.length > 1);
};

export const getRouteStatusColor = (routeStatus: TLatestRouteBySimulationRow["route_status"]) => {
  switch (routeStatus) {
    case "completed":
      return "#22c55e";
    case "running":
      return "#0b57d0";
    case "cancelled":
      return "#ef4444";
    case "planned":
    default:
      return "rgba(148, 163, 184, 1)";
  }
};

export const sortRoutesByDisplayPriority = (routes: DecodedRoute[]): DecodedRoute[] => {
  return [...routes].sort((left, right) => {
    const byStatus =
      ROUTE_STATUS_PRIORITY[left.routeStatus] - ROUTE_STATUS_PRIORITY[right.routeStatus];

    if (byStatus !== 0) {
      return byStatus;
    }

    return left.sequence - right.sequence;
  });
};

export const buildRouteNodes = (routes: TLatestRouteBySimulationRow[]): RouteNode[] => {
  const allNodes: RouteNode[] = [];

  const groupedByCourier = new globalThis.Map<number, TLatestRouteBySimulationRow[]>();

  routes.forEach((r) => {
    const cid = r.courier?.id ?? 0;
    const arr = groupedByCourier.get(cid) ?? [];
    arr.push(r);
    groupedByCourier.set(cid, arr);
  });

  groupedByCourier.forEach((legs) => {
    legs.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

    // Fix #1: Buang zero-distance legs (origin == destination)
    const realLegs = legs.filter(
      (leg) =>
        leg.origin_latitude !== leg.destination_latitude ||
        leg.origin_longitude !== leg.destination_longitude,
    );

    const seenCoords = new Set<string>();
    let stopCounter = 0;

    realLegs.forEach((route, index) => {
      // Fix #2: Hanya push origin untuk leg pertama
      if (index === 0) {
        const key = `${route.origin_latitude.toFixed(6)},${route.origin_longitude.toFixed(6)}`;
        if (!seenCoords.has(key)) {
          seenCoords.add(key);
          allNodes.push({
            lat: route.origin_latitude,
            lng: route.origin_longitude,
            sequence: stopCounter++,
            isOrigin: true,
            isDestination: false,
            visitState: getNodeVisitState(route.route_status, true),
          });
        }
      }

      // Fix #3: Deduplikasi destination berdasarkan koordinat
      const destKey = `${route.destination_latitude.toFixed(6)},${route.destination_longitude.toFixed(6)}`;
      if (!seenCoords.has(destKey)) {
        seenCoords.add(destKey);
        allNodes.push({
          lat: route.destination_latitude,
          lng: route.destination_longitude,
          sequence: stopCounter++,
          isOrigin: false,
          isDestination: true,
          visitState: getNodeVisitState(route.route_status, false),
        });
      }
    });
  });

  return allNodes.sort((left, right) => left.sequence - right.sequence);
};
