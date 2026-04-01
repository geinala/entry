"use client";

import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import maplibregl from "maplibre-gl";
import { useMap } from "./context";

interface MarkerProps {
  lng: number;
  lat: number;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  color?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Marker = ({
  lng,
  lat,
  icon,
  label,
  className = "w-8 h-8",
  color = "#ef4444",
  onClick,
  style,
}: MarkerProps) => {
  const { mapLibreMap } = useMap();
  const iconContainer = useMemo(
    () => (typeof icon !== "string" && icon ? document.createElement("div") : null),
    [icon],
  );

  useEffect(() => {
    if (!mapLibreMap) return;

    const markerOptions: maplibregl.MarkerOptions = {};

    if (icon) {
      const element = document.createElement("div");
      element.style.cursor = onClick ? "pointer" : "default";
      element.style.display = "flex";
      element.style.alignItems = "center";
      element.style.justifyContent = "center";

      if (typeof icon === "string") {
        element.className = className;
        element.style.backgroundImage = `url('${icon}')`;
        element.style.backgroundSize = "contain";
        element.style.backgroundRepeat = "no-repeat";
        if (style) {
          Object.assign(element.style, style);
        }
      } else if (iconContainer) {
        if (style) {
          Object.assign(element.style, style);
        } else {
          element.className = className;
        }
        // Create a wrapper div for the React element with proper sizing
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "center";
        wrapper.appendChild(iconContainer);
        element.appendChild(wrapper);
      } else {
        element.className = className;
      }

      if (onClick) {
        element.addEventListener("click", onClick);
      }

      markerOptions.element = element;
    } else {
      markerOptions.color = color;
    }

    if (label) {
      const marker = new maplibregl.Marker(markerOptions).setLngLat([lng, lat]).addTo(mapLibreMap);
      marker.getElement().title = label;

      return () => {
        marker.remove();
      };
    }

    const marker = new maplibregl.Marker(markerOptions).setLngLat([lng, lat]).addTo(mapLibreMap);

    return () => {
      marker.remove();
    };
  }, [mapLibreMap, lng, lat, icon, iconContainer, label, className, color, onClick, style]);

  return iconContainer ? createPortal(icon, iconContainer) : null;
};
