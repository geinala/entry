"use client";

import Page from "@/app/_components/page";
import { RouteSegmentMain } from "./_components/route-segment/main";
import { AcceptedIncidentDetail } from "./_components/accepted-incident-detail/main";
import { AffectedSegment } from "./_components/affected-segment/main";
import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert";
import { FullRouteComparison } from "./_components/full-route-comparison/main";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function ReoptimizationEventDetailPage() {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Simulations", href: "/simulations" },
      { label: "Event Detail", href: `/simulations/${id}/events/${eventId}` },
    ]);
  }, [setBreadcrumbs, id, eventId]);

  return (
    <Page
      title="Reoptimization Event Detail"
      description="Detailed information about the reoptimization event, including route segments and incidents."
    >
      <main className="overflow-y-auto min-h-0 flex flex-col gap-3">
        <Alert variant="warning">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Visualization is schematic. Spatial validation uses exact route geometry.
          </AlertDescription>
        </Alert>
        <AcceptedIncidentDetail />
        <RouteSegmentMain />
        <AffectedSegment />
        <FullRouteComparison />
      </main>
    </Page>
  );
}
