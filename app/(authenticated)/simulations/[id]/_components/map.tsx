"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Marker, TomTomMap } from "@/app/_components/map";
import { Route } from "@/app/_components/map/route";
import { TLatestRouteBySimulationRow } from "@/types/database";
import {
  buildRouteNodes,
  decodeRoutes,
  getRouteNodeStyle,
  getRouteStatusColor,
  sortRoutesByDisplayPriority,
} from "../_utils/map-route-data";

export interface SimulationVehicleTick {
  id: number;
  courierId: number;
  courierRouteId: number;
  routeLegId: number;
  sequence: number;
  lat: number;
  lng: number;
  speed: number;
  progress: number;
  status: string;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
  routes?: TLatestRouteBySimulationRow[];
  vehicles?: SimulationVehicleTick[];
}

const isNodeAtDepot = (node: { lat: number; lng: number }, center?: [number, number]) => {
  if (!center) {
    return false;
  }

  const EPSILON = 0.000001;

  return Math.abs(node.lng - center[0]) < EPSILON && Math.abs(node.lat - center[1]) < EPSILON;
};

const Map = ({ center, zoom, pitch, bearing, routes = [], vehicles = [] }: MapProps) => {
  const decodedRoutes = useMemo(() => decodeRoutes(routes), [routes]);

  const displayRoutes = useMemo(() => sortRoutesByDisplayPriority(decodedRoutes), [decodedRoutes]);

  const routeNodes = useMemo(() => buildRouteNodes(routes), [routes]);
  const displayVehicles = useMemo(
    () => [...vehicles].sort((left, right) => left.id - right.id),
    [vehicles],
  );

  return (
    <TomTomMap
      center={center}
      zoom={zoom}
      pitch={pitch}
      bearing={bearing}
      showTrafficFlow={false}
      showTrafficIncidents={true}
      style="monoLight"
    >
      {center && (
        <Marker
          lat={center[1]}
          lng={center[0]}
          icon={<Image src="/images/depot.png" alt="Depot" width={96} height={96} />}
          style={{
            width: "96px",
            height: "96px",
          }}
        />
      )}
      {displayRoutes.map((route) => (
        <Route
          key={`${route.id}-${route.routeStatus}-${route.coordinates.length}`}
          id={`route-leg-${route.id}`}
          coordinates={route.coordinates}
          color={getRouteStatusColor(route.routeStatus)}
          width={6}
          opacity={0.9}
        />
      ))}
      {(() => {
        const visibleNodes = routeNodes.filter((n) => !isNodeAtDepot(n, center));

        return visibleNodes.map((node, idx) => {
          const nodeStyle = getRouteNodeStyle(node.visitState);

          return (
            <Marker
              key={`node-seq-${node.sequence}-lat-${node.lat}-lng-${node.lng}-${idx}`}
              lng={node.lng}
              lat={node.lat}
              icon={<span>{node.sequence}</span>}
              className="w-8 h-8"
              style={{
                borderRadius: "9999px",
                border: `2px solid ${nodeStyle.borderColor}`,
                backgroundColor: "#ffffff",
                color: nodeStyle.textColor,
                fontWeight: "700",
                fontSize: "12px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
              }}
            />
          );
        });
      })()}
      {displayVehicles.map((vehicle) => (
        <Marker
          key={`vehicle-${vehicle.id}`}
          lng={vehicle.lng}
          lat={vehicle.lat}
          icon={<Image src="/images/courier.png" alt="Vehicle" width={40} height={40} />}
          className="w-20 h-20"
          style={{
            borderRadius: "9999px",
            border: "2px solid #1d4ed8",
            backgroundColor: "#ffffff",
            color: "#1d4ed8",
            fontWeight: "700",
            fontSize: "12px",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1",
            boxShadow: "0 2px 6px rgba(37, 99, 235, 0.35)",
          }}
        />
      ))}
    </TomTomMap>
  );
};

export default Map;
