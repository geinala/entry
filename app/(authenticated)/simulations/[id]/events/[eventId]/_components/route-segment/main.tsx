"use client";

import SummaryContainer from "@/app/(authenticated)/simulations/_components/summary-container";
import { Route } from "lucide-react";
import { RouteSegmentMap } from "./route-segment.map";
import { IncidentsTable } from "./incidents.table";
import { useGetRouteSegmentCongestionQuery } from "../../_hooks/use-queries";
import { useParams } from "next/navigation";
import { Paragraph } from "@/app/_components/typography";

export const RouteSegmentMain = () => {
  const { eventId, id } = useParams<{ id: string; eventId: string }>();

  const { data } = useGetRouteSegmentCongestionQuery(id, Number(eventId));

  return (
    <SummaryContainer
      title="Route Segment"
      description={
        <>
          Detailed information about the selected route segment, including map visualization and
          incident data.
          <Paragraph className="font-medium">
            From node {data?.fromNode.id} to node {data?.toNode.id}
          </Paragraph>
        </>
      }
      icon={<Route className="text-primary w-full h-full" />}
    >
      <div className="grid grid-cols-3 gap-3 min-h-72">
        <RouteSegmentMap />
        <div className="col-span-2">
          <IncidentsTable />
        </div>
      </div>
    </SummaryContainer>
  );
};
