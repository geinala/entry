"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { TomTomConfig } from "@tomtom-org/maps-sdk/core";
import {
  TomTomMap as TTM,
  TrafficFlowModule,
  TrafficIncidentsModule,
} from "@tomtom-org/maps-sdk/map";
import maplibregl from "maplibre-gl";
import env from "@/common/config/environtment";
import { MapProvider, type MapContextType } from "./context";

const DEFAULT_CENTER: [number, number] = [112.6156684, -7.9467136];
const DEFAULT_ZOOM = 14;

type MapStyleInclude = "hillshade" | "trafficIncidents" | "trafficFlow";
type MapStyleId =
  | "monoLight"
  | "standardLight"
  | "standardDark"
  | "drivingLight"
  | "drivingDark"
  | "monoDark"
  | "satellite";

interface TomTomMapProps {
  children?: ReactNode;
  center?: [number, number];
  zoom?: number;
  showTrafficFlow?: boolean;
  showTrafficIncidents?: boolean;
  style?: MapStyleId;
  containerClassName?: string;
  disablePan?: boolean;
  disableInteractions?: boolean;
  onClick?: (lngLat: { lng: number; lat: number }) => void;
}

const TomTomMapInner = ({
  children,
  center,
  zoom,
  showTrafficFlow = true,
  showTrafficIncidents = true,
  style = "monoLight",
  containerClassName = "relative w-full h-full rounded-lg overflow-hidden",
  disablePan = false,
  disableInteractions = false,
  onClick,
}: TomTomMapProps) => {
  const targetCenter = center ?? DEFAULT_CENTER;
  const targetZoom = zoom ?? DEFAULT_ZOOM;

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<TTM | null>(null);
  const lastViewportRef = useRef<{ center: [number, number]; zoom: number } | null>(null);
  const [mapContext, setMapContext] = useState<MapContextType>({
    map: null,
    mapLibreMap: null,
    marker: null,
  });

  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    TomTomConfig.instance.put({
      apiKey: env.NEXT_PUBLIC_TOMTOM_API_KEY,
      language: "id-ID",
    });

    const include: MapStyleInclude[] = [
      ...(showTrafficFlow ? (["trafficFlow"] as const) : []),
      ...(showTrafficIncidents ? (["trafficIncidents"] as const) : []),
    ];

    const map = new TTM({
      style: {
        include,
        type: "standard",
        id: style,
      },
      mapLibre: {
        container: mapContainerRef.current,
        center: targetCenter,
        zoom: targetZoom,
      },
    });

    lastViewportRef.current = { center: targetCenter, zoom: targetZoom };

    if (showTrafficFlow) {
      TrafficFlowModule.get(map, { visible: true });
    }

    if (showTrafficIncidents) {
      TrafficIncidentsModule.get(map, {
        visible: true,
        icons: { visible: true },
      });
    }

    mapInstanceRef.current = map;

    const onLoad = () => {
      if (disablePan || disableInteractions) {
        map.mapLibreMap.dragPan.disable();
      }

      if (disableInteractions) {
        map.mapLibreMap.scrollZoom.disable();
        map.mapLibreMap.boxZoom.disable();
        map.mapLibreMap.doubleClickZoom.disable();
        map.mapLibreMap.keyboard.disable();
        map.mapLibreMap.touchZoomRotate.disable();
        map.mapLibreMap.dragRotate.disable();
      }

      setMapContext({ map, mapLibreMap: map.mapLibreMap, marker: null });
    };

    if (map.mapLibreMap.loaded()) {
      onLoad();
    } else {
      map.mapLibreMap.on("load", onLoad);
    }

    return () => {
      map.mapLibreMap.off("load", onLoad);
      mapInstanceRef.current?.mapLibreMap.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mapLibre = mapInstanceRef.current?.mapLibreMap;
    if (!mapLibre || !onClick) return;

    const handleClick = (e: maplibregl.MapMouseEvent) => {
      onClick({ lng: e.lngLat.lng, lat: e.lngLat.lat });
    };

    mapLibre.on("click", handleClick);
    return () => {
      mapLibre.off("click", handleClick);
    };
  }, [onClick]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const previousViewport = lastViewportRef.current;
    const hasCenterChanged =
      !previousViewport ||
      previousViewport.center[0] !== targetCenter[0] ||
      previousViewport.center[1] !== targetCenter[1];
    const hasZoomChanged = !previousViewport || previousViewport.zoom !== targetZoom;

    if (!hasCenterChanged && !hasZoomChanged) {
      return;
    }

    mapInstanceRef.current.mapLibreMap.flyTo({
      center: targetCenter,
      zoom: targetZoom,
      duration: 1000,
    });

    lastViewportRef.current = { center: targetCenter, zoom: targetZoom };
  }, [disablePan, targetCenter, targetZoom]);

  return (
    <MapProvider value={mapContext}>
      <div className={containerClassName}>
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute inset-0 pointer-events-none *:pointer-events-auto">
          {mapContext.map && children}
        </div>
      </div>
    </MapProvider>
  );
};

export default TomTomMapInner;
