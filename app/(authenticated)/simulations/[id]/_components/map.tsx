"use client";

import { Marker, TomTomMap } from "@/app/_components/map";
import { Route } from "@/app/_components/map/route";
import { TLatestRouteBySimulationRow } from "@/types/database";
import { useMemo } from "react";
import Image from "next/image";
import { decodePolyline } from "../_utils/decode-polyline";

interface MapProps {
  center?: [number, number];
  zoom?: number;
  routes?: TLatestRouteBySimulationRow[];
}

const Map = ({ center, zoom, routes = [] }: MapProps) => {
  const decodedRoutes = useMemo(() => {
    return routes
      .map((route) => {
        const coordinates = decodePolyline(
          route.encoded_polyline,
          route.encoded_polyline_precision ?? 5,
        );

        return {
          id: String(route.id),
          vehicleId: route.vehicle.id,
          coordinates,
        };
      })
      .filter((route) => route.coordinates.length > 1);
  }, [routes]);

  const routeNodes = useMemo(() => {
    const nodes: Array<{
      lat: number;
      lng: number;
      sequence: number;
      isOrigin: boolean;
      isDestination: boolean;
    }> = [];
    const seenKey = new Set<string>();

    routes.forEach((route) => {
      const originKey = `${route.origin_latitude},${route.origin_longitude}`;
      const destKey = `${route.destination_latitude},${route.destination_longitude}`;

      if (!seenKey.has(originKey)) {
        nodes.push({
          lat: route.origin_latitude,
          lng: route.origin_longitude,
          sequence: route.sequence,
          isOrigin: true,
          isDestination: false,
        });
        seenKey.add(originKey);
      }

      if (!seenKey.has(destKey)) {
        nodes.push({
          lat: route.destination_latitude,
          lng: route.destination_longitude,
          sequence: route.sequence + 1,
          isOrigin: false,
          isDestination: true,
        });
        seenKey.add(destKey);
      }
    });

    return nodes.sort((a, b) => a.sequence - b.sequence);
  }, [routes]);

  const colorPalette = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  return (
    <TomTomMap
      center={center}
      zoom={zoom}
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
      {decodedRoutes.map((route) => (
        <Route
          key={route.id}
          id={`route-leg-${route.id}`}
          coordinates={route.coordinates}
          color={colorPalette[route.vehicleId % colorPalette.length]}
          width={4}
          opacity={0.9}
        />
      ))}
      {routeNodes.map((node, idx) => {
        const isDepot = idx === 0 || idx === routeNodes.length - 1;

        return (
          !isDepot && (
            <Marker
              key={`node-${idx}`}
              lng={node.lng}
              lat={node.lat}
              icon={<span>{node.sequence}</span>}
              className="w-8 h-8"
              style={{
                borderRadius: "9999px",
                border: `2px solid ${node.isOrigin ? "#22c55e" : "#ef4444"}`,
                backgroundColor: "#ffffff",
                color: node.isOrigin ? "#15803d" : "#b91c1c",
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
          )
        );
      })}
    </TomTomMap>
  );
};

export default Map;
