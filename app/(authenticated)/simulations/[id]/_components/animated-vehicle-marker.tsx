"use client";

import { useEffect } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "@/app/_components/map/context";
import { CourierTrack } from "../_utils/map-route-data";
import { interpolatePath } from "../_utils/map-animation";

interface AnimatedVehicleMarkerProps {
  track: CourierTrack;
}

const VEHICLE_MARKER_SIZE = "36px";

const AnimatedVehicleMarker = ({ track }: AnimatedVehicleMarkerProps) => {
  const { mapLibreMap } = useMap();

  useEffect(() => {
    if (!mapLibreMap || track.legs.length === 0) {
      return;
    }

    const firstLeg = track.legs[0];
    const startPosition = firstLeg.coordinates[0];

    if (!startPosition) {
      return;
    }

    const element = document.createElement("div");
    element.style.width = VEHICLE_MARKER_SIZE;
    element.style.height = VEHICLE_MARKER_SIZE;
    element.style.borderRadius = "9999px";
    element.style.border = "2px solid #ffffff";
    element.style.boxShadow = "0 8px 18px rgba(15, 23, 42, 0.28)";
    element.style.backgroundImage = "url('/images/courier.jpg')";
    element.style.backgroundPosition = "center";
    element.style.backgroundRepeat = "no-repeat";
    element.style.backgroundSize = "cover";

    const marker = new maplibregl.Marker({ element })
      .setLngLat([startPosition.lng, startPosition.lat])
      .addTo(mapLibreMap);

    let frameId = 0;
    const startedAt = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startedAt;
      let remainingTime = elapsed;
      let position = startPosition;

      for (const leg of track.legs) {
        const endPosition = leg.coordinates[leg.coordinates.length - 1];
        const travelTimeMs = Math.max(leg.travelTimeMs, 0);

        if (travelTimeMs === 0) {
          position = endPosition;
          continue;
        }

        if (remainingTime < travelTimeMs) {
          const progress = remainingTime / travelTimeMs;
          position = interpolatePath(leg.coordinates, progress) ?? endPosition;
          marker.setLngLat([position.lng, position.lat]);
          frameId = requestAnimationFrame(animate);
          return;
        }

        remainingTime -= travelTimeMs;
        position = endPosition;
      }

      marker.setLngLat([position.lng, position.lat]);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      marker.remove();
    };
  }, [mapLibreMap, track]);

  return null;
};

export default AnimatedVehicleMarker;
