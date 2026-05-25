"use client";

import SummaryContainer from "@/app/(authenticated)/simulations/_components/summary-container";
import dynamic from "next/dynamic";
import {
  useGetRouteSegmentAffectedIncidentsQuery,
  useGetRouteSegmentCongestionQuery,
} from "../../_hooks/use-queries";
import { useParams } from "next/navigation";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { Route } from "@/app/_components/map/route";
import {
  decodePolyline,
  formatSeconds,
  geometryToCoordinates,
  getAutoZoom,
  getRouteCenter,
} from "@/lib/utils";
import { Badge } from "@/app/_components/ui/badge";
import { useMemo } from "react";
import { Map } from "lucide-react";

const TomTomMap = dynamic(
  () => import("@/app/_components/map").then((module) => module.TomTomMap),
  { ssr: false },
);

export const AffectedSegment = () => {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();

  const { data, isLoading } = useGetRouteSegmentAffectedIncidentsQuery(id, Number(eventId));
  const { data: congestionData, isLoading: isCongestionLoading } =
    useGetRouteSegmentCongestionQuery(id, Number(eventId));
  const beforeRouteSegment = decodePolyline(data?.beforeRoute.encodedPolyline || "");
  const beforeCenterCoor = getRouteCenter(beforeRouteSegment);
  const beforeZoom = useMemo(() => getAutoZoom(beforeRouteSegment), [beforeRouteSegment]);
  const afterRouteSegment = decodePolyline(data?.afterRoute.encodedPolyline || "");
  const afterCenterCoor = getRouteCenter(afterRouteSegment);
  const afterZoom = useMemo(() => getAutoZoom(afterRouteSegment), [afterRouteSegment]);
  const timeSaved = data?.timeSavedInSeconds;

  return (
    <SummaryContainer
      title="Affected Segment"
      description="The segment of the route that is affected by the accepted incident. The affected segment is determined based on the overlap between the route segment and the incident geometry."
      icon={<Map className="text-primary w-full h-full" />}
    >
      {isLoading || isCongestionLoading ? (
        <Skeleton className="w-full h-48" />
      ) : (
        <div className="grid grid-cols-2 gap-3 h-96">
          <div className="w-full flex flex-col gap-3">
            <Badge variant="outline">Before</Badge>
            <div className="relative h-full">
              <TomTomMap
                center={beforeCenterCoor}
                disableInteractions
                showTrafficFlow={false}
                showTrafficIncidents={false}
                zoom={beforeZoom}
              >
                {congestionData?.acceptedIncident && (
                  <Route
                    coordinates={geometryToCoordinates(congestionData.acceptedIncident.geometry)}
                    label="Traffic Incident"
                    color="red"
                    width={2}
                  />
                )}
                <Route coordinates={beforeRouteSegment} label="Before" color="blue" width={2} />
              </TomTomMap>
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <Badge variant="outline">After</Badge>
            <div className="relative h-full">
              <Badge variant="success" className="absolute top-4 left-4 z-10">
                Time Saved:{" "}
                {timeSaved ? formatSeconds(timeSaved, ["hours", "minutes", "seconds"]) : "N/A"}
              </Badge>
              <TomTomMap
                center={afterCenterCoor}
                disableInteractions
                showTrafficFlow={false}
                showTrafficIncidents={false}
                zoom={afterZoom}
              >
                {congestionData?.acceptedIncident && (
                  <Route
                    coordinates={geometryToCoordinates(congestionData.acceptedIncident.geometry)}
                    label="Traffic Incident"
                    color="red"
                    width={2}
                  />
                )}
                <Route coordinates={afterRouteSegment} label="After" color="green" width={2} />
              </TomTomMap>
            </div>
          </div>
        </div>
      )}
    </SummaryContainer>
  );
};
