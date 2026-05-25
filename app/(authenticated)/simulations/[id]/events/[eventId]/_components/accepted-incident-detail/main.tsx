"use client";

import { useParams } from "next/navigation";
import {
  useGetIncidentRouteSegmentByTomTomIdsQuery,
  useGetRouteSegmentCongestionIncidentsQuery,
} from "../../_hooks/use-queries";
import SummaryContainer from "@/app/(authenticated)/simulations/_components/summary-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { formatSeconds } from "@/lib/utils";
import { useMemo } from "react";
import { Activity, MoveRight } from "lucide-react";

export const AcceptedIncidentDetail = () => {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();

  const { data } = useGetRouteSegmentCongestionIncidentsQuery(id, Number(eventId));

  const acceptedIncidents = useMemo(() => data?.filter((d) => d.isValidCongestion) ?? [], [data]);
  const tomTomSegmentIds = useMemo(
    () => data?.map((debug) => debug.tomtomIncidentId) ?? [],
    [data],
  );

  const { data: incidents } = useGetIncidentRouteSegmentByTomTomIdsQuery(id, tomTomSegmentIds);

  return (
    <SummaryContainer
      title="Accepted Incident Detail"
      description="Detail information about the accepted incident for this route segment."
      icon={<Activity className="text-primary w-full h-full" />}
    >
      {acceptedIncidents.length > 0 ? (
        acceptedIncidents.map((acceptedIncident) => {
          const acceptedIncidentDetail = incidents?.find(
            (incident) => incident.tomtomIncidentId === acceptedIncident.tomtomIncidentId,
          );
          const key =
            acceptedIncident.tomtomIncidentId ??
            `${acceptedIncident.delayInSeconds}-${acceptedIncident.overlapRatio}`;

          return (
            <div key={key} className="mb-4">
              <div className="grid grid-cols-4 gap-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Delay</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex items-end font-medium">
                    {formatSeconds(acceptedIncident?.delayInSeconds || 0, [
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
                  <CardContent className="h-full flex items-end font-medium">
                    {((acceptedIncident?.overlapRatio ?? 0) * 100).toFixed(2)}%
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Intersection</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex items-end font-medium">
                    {acceptedIncident?.routeIntersects ? "Yes" : "No"}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Location</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex items-end font-medium">
                    {acceptedIncidentDetail && (
                      <div className="flex items-center gap-3 flex-wrap">
                        {acceptedIncidentDetail.fromAddress} <MoveRight />{" "}
                        {acceptedIncidentDetail.toAddress}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-muted-foreground">No accepted incidents.</div>
      )}
    </SummaryContainer>
  );
};
