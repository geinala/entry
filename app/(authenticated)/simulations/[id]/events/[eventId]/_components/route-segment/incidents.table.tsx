"use client";

import { useParams } from "next/navigation";
import { useGetRouteSegmentCongestionIncidentsQuery } from "../../_hooks/use-queries";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/app/_components/ui/table";
import { formatSeconds } from "@/lib/utils";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { TRouteLegCongestionCheckIncident } from "@/types/database";
import { Badge } from "@/app/_components/ui/badge";

export const IncidentsTable = () => {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();
  const { data, isLoading } = useGetRouteSegmentCongestionIncidentsQuery(id, Number(eventId));

  if (isLoading) {
    return <Skeleton className="w-full h-24" />;
  }

  const getStatusText = (debug: TRouteLegCongestionCheckIncident) => {
    if (debug.isValidCongestion) {
      return "Accepted";
    }

    const reasons: string[] = [];

    if (debug.rejectedReasons.includes("delay_below_threshold")) {
      reasons.push(`Delay < ${debug.delayThresholdInSeconds}s`);
    }

    if (debug.rejectedReasons.includes("insufficient_route_overlap")) {
      reasons.push(`Overlap < ${(debug.overlapThreshold * 100).toFixed(0)}%`);
    }

    if (debug.rejectedReasons.includes("direction_mismatch")) {
      reasons.push("Direction Mismatch");
    }

    return reasons.join(", ");
  };

  return (
    <div className="h-full flex flex-col justify-between items-end w-full">
      <div className="max-h-96 overflow-y-auto rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="font-semibold">Incident Id</TableCell>
              <TableCell className="font-semibold">Delay</TableCell>
              <TableCell className="font-semibold">Intersection</TableCell>
              <TableCell className="font-semibold">Overlap</TableCell>
              <TableCell className="font-semibold">Direction Match</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              ?.slice()
              .sort((a, b) => {
                if (a.isValidCongestion !== b.isValidCongestion) {
                  return a.isValidCongestion ? -1 : 1;
                }

                return b.overlapRatio - a.overlapRatio;
              })
              .map((congestionCheck) => (
                <TableRow
                  key={congestionCheck.id}
                  className={congestionCheck.isValidCongestion ? "bg-green-200!" : ""}
                >
                  <TableCell>{congestionCheck.trafficIncident?.tomtomIncidentId}</TableCell>
                  <TableCell>
                    {formatSeconds(congestionCheck.delayInSeconds, ["hours", "minutes", "seconds"])}
                  </TableCell>
                  <TableCell>{congestionCheck.routeIntersects ? "Yes" : "No"}</TableCell>
                  <TableCell>{(congestionCheck.overlapRatio * 100).toFixed(2)}%</TableCell>
                  <TableCell>{congestionCheck.directionMatches ? "Yes" : "No"}</TableCell>
                  <TableCell>{getStatusText(congestionCheck)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-3 flex gap-3">
        <Badge variant={"outline"}>
          Delay ≥{" "}
          {formatSeconds(data?.[0].delayThresholdInSeconds ?? 0, ["hours", "minutes", "seconds"])}
        </Badge>
        <Badge variant={"outline"}>
          Overlap ≥ {((data?.[0].overlapThreshold ?? 0) * 100).toFixed(0)}%
        </Badge>
        <Badge variant={"outline"}>
          Proximity {data?.[0].proximityThresholdInMeters ?? 0} meters
        </Badge>
      </div>
    </div>
  );
};
