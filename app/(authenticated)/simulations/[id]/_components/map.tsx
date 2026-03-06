"use client";

import { Marker, TomTomMap } from "@/app/_components/map";

interface MapProps {
  center?: [number, number];
  zoom?: number;
}

const Map = ({ center, zoom }: MapProps) => {
  return (
    <TomTomMap
      center={center}
      zoom={zoom}
      showTrafficFlow={true}
      showTrafficIncidents={true}
      style="monoLight"
    >
      {center && <Marker lat={center[1]} lng={center[0]} />}
    </TomTomMap>
  );
};

export default Map;
