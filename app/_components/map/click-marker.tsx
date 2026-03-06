"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "./context";

interface ClickMarkerProps {
  onChange?: (lngLat: { lng: number; lat: number }) => void;
  color?: string;
}

export const ClickMarker = ({ onChange, color = "#ef4444" }: ClickMarkerProps) => {
  const { mapLibreMap } = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [position, setPosition] = useState<{ lng: number; lat: number } | null>(null);

  useEffect(() => {
    if (!mapLibreMap) return;

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      const lngLat = { lng: e.lngLat.lng, lat: e.lngLat.lat };
      setPosition(lngLat);
      onChange?.(lngLat);
    };

    mapLibreMap.on("click", handleClick);
    return () => {
      mapLibreMap.off("click", handleClick);
    };
  }, [mapLibreMap, onChange]);

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
