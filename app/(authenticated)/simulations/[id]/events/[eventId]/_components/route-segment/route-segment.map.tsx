"use client";

import dynamic from "next/dynamic";
import { BoundingBox, Marker } from "@/app/_components/map";
import { useParams } from "next/navigation";
import {
  useGetIncidentRouteSegmentByTomTomIdsQuery,
  useGetRouteSegmentCongestionIncidentsQuery,
  useGetRouteSegmentCongestionQuery,
} from "../../_hooks/use-queries";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { Route } from "@/app/_components/map/route";
import { useMemo } from "react";
import { decodePolyline, geometryToCoordinates, getAutoZoom, getRouteCenter } from "@/lib/utils";
import { Badge } from "@/app/_components/ui/badge";

const TomTomMap = dynamic(
  () => import("@/app/_components/map").then((module) => module.TomTomMap),
  { ssr: false },
);

export const RouteSegmentMap = () => {
  const { eventId, id } = useParams<{ id: string; eventId: string }>();

  const { data, isLoading } = useGetRouteSegmentCongestionQuery(id, Number(eventId));
  const { data: matchDetails } = useGetRouteSegmentCongestionIncidentsQuery(id, Number(eventId));

  const tomTomSegmentIds = useMemo(
    () => matchDetails?.map((debug) => debug.tomtomIncidentId),
    [matchDetails],
  );

  const { data: incidents } = useGetIncidentRouteSegmentByTomTomIdsQuery(id, tomTomSegmentIds);

  const decodedRoutes = useMemo(
    () => decodePolyline(data?.routeSegmentPolyline || ""),
    [data?.routeSegmentPolyline],
  );
  const routeCenter = useMemo(() => getRouteCenter(decodedRoutes), [decodedRoutes]);
  const zoom = getAutoZoom(decodedRoutes);
  const acceptedIncidentId = data?.acceptedIncident?.id;

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  return (
    <div className="w-full flex-col flex items-center justify-center gap-3 max-h-100">
      <div className="w-full rounded-md overflow-hidden h-100">
        <TomTomMap
          center={routeCenter}
          zoom={zoom}
          containerClassName="w-full h-full"
          showTrafficFlow={false}
          showTrafficIncidents={false}
        >
          {data && (
            <BoundingBox
              minLat={data.bboxMinLat}
              minLng={data.bboxMinLon}
              maxLat={data.bboxMaxLat}
              maxLng={data.bboxMaxLon}
              color="#ef4444"
              width={2}
              opacity={0.9}
              dashArray={[2, 2]}
            />
          )}
          {/* Traffic Incident */}
          {data?.acceptedIncident && (
            <Route
              coordinates={geometryToCoordinates(data?.acceptedIncident.geometry)}
              label="Traffic Incident"
              color="red"
              width={2}
            />
          )}
          {(incidents ?? []).map((incident) => (
            <Route
              key={incident.id}
              coordinates={geometryToCoordinates(incident.geometry)}
              label={incident.tomtomIncidentId}
              color="red"
              width={2}
              opacity={incident.id === acceptedIncidentId ? 1 : 0.5}
            />
          ))}
          <Route coordinates={decodedRoutes} color="#3b82f6" width={2} opacity={0.4} />
          {data?.fromNode && (
            <Marker lat={data.fromNode.latitude} lng={data.fromNode.longitude} label="From" />
          )}
          {data?.toNode && (
            <Marker lat={data.toNode.latitude} lng={data.toNode.longitude} label="To" />
          )}
        </TomTomMap>
      </div>
      <div className="flex w-full flex-wrap gap-2">
        <Badge variant="outline">Min Lat: {data?.bboxMinLat?.toFixed(6)}</Badge>
        <Badge variant="outline">Max Lat: {data?.bboxMaxLat?.toFixed(6)}</Badge>
        <Badge variant="outline">Min Lon: {data?.bboxMinLon?.toFixed(6)}</Badge>
        <Badge variant="outline">Max Lon: {data?.bboxMaxLon?.toFixed(6)}</Badge>
      </div>
    </div>
  );
};
