"use client";

import { createContext, useContext, ReactNode } from "react";
import { TomTomMap as TTM } from "@tomtom-org/maps-sdk/map";
import maplibregl from "maplibre-gl";

export interface MapContextType {
  map: TTM | null;
  mapLibreMap: maplibregl.Map | null;
  marker: maplibregl.Marker | null;
}

const MapContext = createContext<MapContextType | null>(null);

export function useMap(): MapContextType {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("useMap must be used within <TomTomMap>");
  }

  return context;
}

export function MapProvider({ children, value }: { children: ReactNode; value: MapContextType }) {
  return <MapContext value={value}>{children}</MapContext>;
}
