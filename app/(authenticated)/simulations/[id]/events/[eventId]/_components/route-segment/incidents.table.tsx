"use client";

import { useParams } from "next/navigation";
import { useGetRouteSegmentCongestionCheckMatchDetailsQuery } from "../../_hooks/use-queries";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/app/_components/ui/table";
import { formatSeconds } from "@/lib/utils";
import { Skeleton } from "@/app/_components/ui/skeleton";
import { TIncidentMatchDebug } from "@/types/database";
import { Badge } from "@/app/_components/ui/badge";

export const IncidentsTable = () => {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();
  const { data, isLoading } = useGetRouteSegmentCongestionCheckMatchDetailsQuery(
    id,
    Number(eventId),
  );

  if (isLoading) {
    return <Skeleton className="w-full h-24" />;
  }

  const getStatusText = (debug: TIncidentMatchDebug) => {
    if (debug.is_valid_congestion) {
      return "Accepted";
    }

    const reasons: string[] = [];

    if (debug.rejected_reasons.includes("delay_below_threshold")) {
      reasons.push(`Delay < ${debug.delay_threshold_seconds}s`);
    }

    if (debug.rejected_reasons.includes("insufficient_route_overlap")) {
      reasons.push(`Overlap < ${(debug.overlap_threshold_ratio * 100).toFixed(0)}%`);
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
              <TableCell className="font-semibold">Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data?.incident_match_debugs ?? [])
              .slice()
              .sort((a, b) => {
                if (a.is_valid_congestion !== b.is_valid_congestion) {
                  return a.is_valid_congestion ? -1 : 1;
                }

                return b.overlap_ratio - a.overlap_ratio;
              })
              .map((debug) => (
                <TableRow
                  key={debug.incident_id}
                  className={debug.is_valid_congestion ? "bg-green-200!" : ""}
                >
                  <TableCell>{debug.incident_id}</TableCell>
                  <TableCell>
                    {formatSeconds(debug.incident_delay_seconds, ["hours", "minutes", "seconds"])}
                  </TableCell>
                  <TableCell>{debug.route_intersects ? "Yes" : "No"}</TableCell>
                  <TableCell>{(debug.overlap_ratio * 100).toFixed(2)}%</TableCell>
                  <TableCell>{getStatusText(debug)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-3 flex gap-3">
        <Badge variant={"secondary"}>
          Delay ≥ {formatSeconds(data?.threshold_seconds ?? 0, ["hours", "minutes", "seconds"])}
        </Badge>
        <Badge variant={"secondary"}>
          Overlap ≥{" "}
          {((data?.incident_match_debugs?.[0]?.overlap_threshold_ratio ?? 0) * 100).toFixed(0)}%
        </Badge>
        <Badge variant={"secondary"}>
          Proximity {data?.incident_match_debugs?.[0]?.proximity_threshold_m ?? 0} meters
        </Badge>
      </div>
    </div>
  );
};
