"use client";

import { useEffect, useRef } from "react";
import { TomTomConfig } from "@tomtom-org/maps-sdk/core";
import {
  TomTomMap as TTM,
  TrafficFlowModule,
  TrafficIncidentsModule,
} from "@tomtom-org/maps-sdk/map";
import env from "@/common/config/environtment";

const TomTomMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<TTM | null>(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    TomTomConfig.instance.put({
      apiKey: env.NEXT_PUBLIC_TOMTOM_API_KEY,
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

    mapInstanceRef.current = map;

    return () => {
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
