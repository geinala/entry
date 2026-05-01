"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "./context";
import { useQueryClient } from "@tanstack/react-query";
import { ISearchResult, mapQueries } from "./_api/queries";

interface ClickMarkerProps {
  onChange?: (lngLat: { lng: number; lat: number }, nearestLocation?: ISearchResult) => void;
  color?: string;
  position?: { lng: number; lat: number } | null;
}

export const ClickMarker = ({ onChange, color = "#ef4444", position: controlledPosition }: ClickMarkerProps) => {
  const { mapLibreMap } = useMap();
  const queryClient = useQueryClient();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const clickRequestRef = useRef(0);
  const [internalPosition, setInternalPosition] = useState<{ lng: number; lat: number } | null>(null);
  const position = controlledPosition ?? internalPosition;

  useEffect(() => {
    if (!mapLibreMap) return;

    const handleClick = async (e: maplibregl.MapMouseEvent) => {
      const lngLat = { lng: e.lngLat.lng, lat: e.lngLat.lat };
      const requestId = ++clickRequestRef.current;

      setInternalPosition(lngLat);

      try {
        const nearbyLocations = await queryClient.fetchQuery(
          mapQueries.nearbySearch({ lat: lngLat.lat, lng: lngLat.lng }),
        );

        if (clickRequestRef.current !== requestId) return;

        onChange?.(lngLat, nearbyLocations[0]);
      } catch {
        if (clickRequestRef.current !== requestId) return;

        onChange?.(lngLat);
      }
    };

    mapLibreMap.on("click", handleClick);
    return () => {
      mapLibreMap.off("click", handleClick);
    };
  }, [mapLibreMap, onChange, queryClient]);

  useEffect(() => {
    if (!mapLibreMap || !position) return;

    if (markerRef.current) {
      markerRef.current.setLngLat([position.lng, position.lat]);
    } else {
      markerRef.current = new maplibregl.Marker({ color })
        .setLngLat([position.lng, position.lat])
        .addTo(mapLibreMap);
    }
  }, [mapLibreMap, position, color]);

  useEffect(() => {
    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
    };
  }, []);

  return null;
};
