"use client";

import { useEffect, useId } from "react";
import type { GeoJSONSource } from "maplibre-gl";
import { useMap } from "./context";

interface BoundingBoxProps {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
  id?: string;
  color?: string;
  width?: number;
  opacity?: number;
  dashArray?: [number, number];
}

export const BoundingBox = ({
  minLat,
  minLng,
  maxLat,
  maxLng,
  id,
  color = "#f59e0b",
  width = 2,
  opacity = 1,
  dashArray = [2, 2],
}: BoundingBoxProps) => {
  const { mapLibreMap } = useMap();
  const fallbackId = `bounding-box-${useId().replace(/:/g, "")}`;
  const boundingBoxId = id ?? fallbackId;

  useEffect(() => {
    if (!mapLibreMap) return;

    const hasStyle = () => {
      try {
        return Boolean(mapLibreMap.getStyle());
      } catch {
        return false;
      }
    };

    if (!hasStyle()) return;

    const coordinates = [
      [minLng, minLat],
      [maxLng, minLat],
      [maxLng, maxLat],
      [minLng, maxLat],
      [minLng, minLat],
    ];

    const data = {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [coordinates],
      },
      properties: {},
    };

    const existingSource = mapLibreMap.getSource(boundingBoxId) as GeoJSONSource | undefined;
    if (!existingSource) {
      mapLibreMap.addSource(boundingBoxId, { type: "geojson", data });
    } else {
      existingSource.setData(data);
    }

    const layerId = `${boundingBoxId}-layer`;
    if (!mapLibreMap.getLayer(layerId)) {
      mapLibreMap.addLayer({
        id: layerId,
        type: "line",
        source: boundingBoxId,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity,
          "line-dasharray": dashArray,
        },
      });
    }

    return () => {
      if (!hasStyle()) return;

      if (mapLibreMap.getLayer(layerId)) {
        mapLibreMap.removeLayer(layerId);
      }
      if (mapLibreMap.getSource(boundingBoxId)) {
        mapLibreMap.removeSource(boundingBoxId);
      }
    };
  }, [
    boundingBoxId,
    color,
    dashArray,
    mapLibreMap,
    maxLat,
    maxLng,
    minLat,
    minLng,
    opacity,
    width,
  ]);

  return null;
};
