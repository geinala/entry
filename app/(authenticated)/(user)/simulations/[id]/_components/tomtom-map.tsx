"use client";

import { useEffect, useRef } from "react";
import { TomTomConfig } from "@tomtom-org/maps-sdk/core";
import {
  TomTomMap as TTM,
  TrafficFlowModule,
  TrafficIncidentsModule,
} from "@tomtom-org/maps-sdk/map";
import env from "@/common/config/environtment";
import maplibregl from "maplibre-gl";

const TomTomMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<TTM | null>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    TomTomConfig.instance.put({
      apiKey: env.TOMTOM_API_KEY,
      language: "id-ID",
    });

    const map = new TTM({
      style: { include: ["trafficFlow", "trafficIncidents"], type: "standard", id: "monoLight" },
      mapLibre: {
        container: mapContainerRef.current,
        center: [112.6156684, -7.9467136],
        zoom: 14,
      },
    });
    TrafficFlowModule.get(map, { visible: true });
    TrafficIncidentsModule.get(map, {
      visible: true,
      icons: { visible: true },
    });
    const depotCoord: [number, number] = [112.6156684, -7.9467136];
    const depotEl = document.createElement("div");
    depotEl.className = "depot-marker";
    depotEl.style.backgroundImage = "url('/images/logo.png')";
    depotEl.style.width = "36px";
    depotEl.style.height = "36px";
    depotEl.style.backgroundSize = "contain";

    new maplibregl.Marker({ element: depotEl }).setLngLat(depotCoord).addTo(map.mapLibreMap);

    mapInstanceRef.current = map;

    return () => {
      mapInstanceRef.current?.mapLibreMap.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};

export default TomTomMap;
