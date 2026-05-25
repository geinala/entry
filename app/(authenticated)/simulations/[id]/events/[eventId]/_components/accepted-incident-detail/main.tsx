"use client";

import { useParams } from "next/navigation";
import {
  useGetIncidentRouteSegmentByTomTomIdsQuery,
  useGetRouteSegmentCongestionCheckMatchDetailsQuery,
} from "../../_hooks/use-queries";
import SummaryContainer from "@/app/(authenticated)/simulations/_components/summary-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { formatSeconds, geometryToCoordinates, getRouteCenter } from "@/lib/utils";
import { useMemo } from "react";
import { Activity } from "lucide-react";

export const AcceptedIncidentDetail = () => {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();

  const { data } = useGetRouteSegmentCongestionCheckMatchDetailsQuery(id, Number(eventId));

  const acceptedIncident = data?.incident_match_debugs.find((debug) => debug.is_valid_congestion);
  const tomTomSegmentIds = useMemo(
    () => (data?.incident_match_debugs ?? []).map((debug) => debug.incident_id),
    [data?.incident_match_debugs],
  );

  const { data: incidents } = useGetIncidentRouteSegmentByTomTomIdsQuery(id, tomTomSegmentIds);
  const acceptedIncidentDetail = useMemo(() => {
    if (!acceptedIncident || !incidents) return null;
    return incidents.find((incident) => incident.tomtomIncidentId === acceptedIncident.incident_id);
  }, [acceptedIncident, incidents]);
  const routeCenter = useMemo<[number, number] | null>(() => {
    if (!acceptedIncidentDetail) return null;
    const geometryCoordinates = geometryToCoordinates(acceptedIncidentDetail.geometry);
    return getRouteCenter(geometryCoordinates) ?? null;
  }, [acceptedIncidentDetail]);

  return (
    <SummaryContainer
      title="Accepted Incident Detail"
      description="Detail information about the accepted incident for this route segment."
      icon={<Activity className="text-primary w-full h-full" />}
    >
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardHeader>
            <CardTitle>Delay</CardTitle>
          </CardHeader>
          <CardContent>
            {formatSeconds(acceptedIncident?.incident_delay_seconds || 0, [
              "hours",
              "minutes",
              "seconds",
            ])}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overlap Ratio</CardTitle>
          </CardHeader>
          <CardContent>{((acceptedIncident?.overlap_ratio ?? 0) * 100).toFixed(2)}%</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Intersection</CardTitle>
          </CardHeader>
          <CardContent>{acceptedIncident?.route_intersects ? "Yes" : "No"}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            {routeCenter && (
              <div>
                Lat: {routeCenter[1]}, Lng: {routeCenter[0]}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SummaryContainer>
  );
};
