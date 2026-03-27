"use client";

import { useEffect } from "react";
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
  id = `route-${Math.random()}`,
  color = "#FF0000",
  width = 3,
  opacity = 1,
  label,
}: RouteProps) => {
  const { mapLibreMap } = useMap();

  useEffect(() => {
    if (!mapLibreMap || coordinates.length < 2) return;

    const data: GeoJSONFeature = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates.map((c) => [c.lng, c.lat]),
      },
      properties: { label: label ?? null },
    };

    const existingSource = mapLibreMap.getSource(id) as GeoJSONSource | undefined;
    if (!existingSource) {
      mapLibreMap.addSource(id, { type: "geojson", data });
    } else {
      existingSource.setData(data);
    }

    const layerId = `${id}-layer`;
    if (!mapLibreMap.getLayer(layerId)) {
      mapLibreMap.addLayer({
        id: layerId,
        type: "line",
        source: id,
        paint: {
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
        },
      });
    }

    return () => {
      if (mapLibreMap.getLayer(layerId)) {
        mapLibreMap.removeLayer(layerId);
      }
      if (mapLibreMap.getSource(id)) {
        mapLibreMap.removeSource(id);
      }
    };
  }, [mapLibreMap, coordinates, id, color, width, opacity, label]);

  return null;
};
