"use client";

import { useEffect, useId } from "react";
import type { GeoJSONSource } from "maplibre-gl";
import { useMap } from "./context";

interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
  properties: Record<string, unknown>;
}

interface Coordinate {
  lng: number;
  lat: number;
}

interface RouteProps {
  coordinates: Coordinate[];
  id?: string;
  color?: string;
  width?: number;
  opacity?: number;
  label?: string;
}

export const Route = ({
  coordinates,
  id,
  color = "#FF0000",
  width = 6,
  opacity = 1,
  label,
}: RouteProps) => {
  const { mapLibreMap } = useMap();
  const fallbackId = `route-${useId().replace(/:/g, "")}`;
  const routeId = id ?? fallbackId;

  useEffect(() => {
    if (!mapLibreMap || coordinates.length < 2) return;

    const hasStyle = () => {
      try {
        return Boolean(mapLibreMap.getStyle());
      } catch {
        return false;
      }
    };

    if (!hasStyle()) return;

    const data: GeoJSONFeature = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates.map((c) => [c.lng, c.lat]),
      },
      properties: { label: label ?? null },
    };

    const existingSource = mapLibreMap.getSource(routeId) as GeoJSONSource | undefined;
    if (!existingSource) {
      mapLibreMap.addSource(routeId, { type: "geojson", data });
    } else {
      existingSource.setData(data);
    }

    const outlineLayerId = `${routeId}-outline-layer`;
    if (!mapLibreMap.getLayer(outlineLayerId)) {
      mapLibreMap.addLayer({
        id: outlineLayerId,
        type: "line",
        source: routeId,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#000000",
          "line-width": width + 2,
          "line-opacity": opacity,
        },
      });
    }

    const layerId = `${routeId}-layer`;
    if (!mapLibreMap.getLayer(layerId)) {
      mapLibreMap.addLayer({
        id: layerId,
        type: "line",
        source: routeId,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
        },
      });
    }

    return () => {
      if (!hasStyle()) return;

      if (mapLibreMap.getLayer(layerId)) {
        mapLibreMap.removeLayer(layerId);
      }
      if (mapLibreMap.getLayer(outlineLayerId)) {
        mapLibreMap.removeLayer(outlineLayerId);
      }
      if (mapLibreMap.getSource(routeId)) {
        mapLibreMap.removeSource(routeId);
      }
    };
  }, [mapLibreMap, coordinates, routeId, color, width, opacity, label]);

  return null;
};
