import { TLatestRouteBySimulationRow } from "@/types/database";
import { decodePolyline } from "./decode-polyline";
import { MapCoordinate } from "./map-animation";

export type DecodedRoute = {
  id: string;
  courierId: string;
  sequence: number;
  travelTimeMs: number;
  routeStatus: TLatestRouteBySimulationRow["route_status"];
  coordinates: MapCoordinate[];
};

export type CourierTrack = {
  courierId: string;
  legs: DecodedRoute[];
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

const ROUTE_NODE_VISIT_PRIORITY: Record<RouteNodeVisitState, number> = {
  pending: 0,
  "running-destination": 1,
  "running-origin": 2,
  visited: 3,
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

export const buildCourierTracks = (decodedRoutes: DecodedRoute[]): CourierTrack[] => {
  const groupedTracks = new globalThis.Map<string, DecodedRoute[]>();

  decodedRoutes.forEach((route) => {
    const track = groupedTracks.get(route.courierId);

    if (track) {
      track.push(route);
      return;
    }

    groupedTracks.set(route.courierId, [route]);
  });

  return Array.from(groupedTracks.entries()).map(([courierId, legs]) => ({
    courierId,
    legs: legs.sort((left, right) => left.sequence - right.sequence),
  }));
};

export const buildRouteNodes = (routes: TLatestRouteBySimulationRow[]): RouteNode[] => {
  const nodesByKey = new globalThis.Map<string, RouteNode>();

  const upsertNode = ({
    key,
    lat,
    lng,
    sequence,
    isOrigin,
    isDestination,
    visitState,
  }: {
    key: string;
    lat: number;
    lng: number;
    sequence: number;
    isOrigin: boolean;
    isDestination: boolean;
    visitState: RouteNodeVisitState;
  }) => {
    const existing = nodesByKey.get(key);

    if (!existing) {
      nodesByKey.set(key, {
        lat,
        lng,
        sequence,
        isOrigin,
        isDestination,
        visitState,
      });
      return;
    }

    const nextVisitState =
      ROUTE_NODE_VISIT_PRIORITY[visitState] > ROUTE_NODE_VISIT_PRIORITY[existing.visitState]
        ? visitState
        : existing.visitState;

    nodesByKey.set(key, {
      ...existing,
      sequence: Math.min(existing.sequence, sequence),
      isOrigin: existing.isOrigin || isOrigin,
      isDestination: existing.isDestination || isDestination,
      visitState: nextVisitState,
    });
  };

  const groupedByCourier = new globalThis.Map<number, TLatestRouteBySimulationRow[]>();

  routes.forEach((r) => {
    const cid = r.courier?.id ?? 0;
    const arr = groupedByCourier.get(cid) ?? [];
    arr.push(r);
    groupedByCourier.set(cid, arr);
  });

  groupedByCourier.forEach((legs) => {
    legs.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

    legs.forEach((route) => {
      const originKey = `${route.origin_latitude},${route.origin_longitude}`;
      const destinationKey = `${route.destination_latitude},${route.destination_longitude}`;

      // Use DB-provided sequence values (origin => route.sequence, destination => route.sequence + 1)
      const originSeq = route.sequence ?? 0;
      const destinationSeq = (route.sequence ?? 0) + 1;

      if (!nodesByKey.has(originKey)) {
        upsertNode({
          key: originKey,
          lat: route.origin_latitude,
          lng: route.origin_longitude,
          sequence: originSeq,
          isOrigin: true,
          isDestination: false,
          visitState: getNodeVisitState(route.route_status, true),
        });
      } else {
        upsertNode({
          key: originKey,
          lat: route.origin_latitude,
          lng: route.origin_longitude,
          sequence: nodesByKey.get(originKey)!.sequence,
          isOrigin: true,
          isDestination: false,
          visitState: getNodeVisitState(route.route_status, true),
        });
      }

      if (!nodesByKey.has(destinationKey)) {
        upsertNode({
          key: destinationKey,
          lat: route.destination_latitude,
          lng: route.destination_longitude,
          sequence: destinationSeq,
          isOrigin: false,
          isDestination: true,
          visitState: getNodeVisitState(route.route_status, false),
        });
      } else {
        upsertNode({
          key: destinationKey,
          lat: route.destination_latitude,
          lng: route.destination_longitude,
          sequence: nodesByKey.get(destinationKey)!.sequence,
          isOrigin: false,
          isDestination: true,
          visitState: getNodeVisitState(route.route_status, false),
        });
      }
    });
  });

  return Array.from(nodesByKey.values()).sort((left, right) => left.sequence - right.sequence);
};
