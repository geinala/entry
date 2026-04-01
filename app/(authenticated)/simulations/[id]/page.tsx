"use client";

import SimulationsLayoutShell from "../_components/layout-shell";
import { SimulationDetailLeftSidebar, SimulationDetailRightSidebar } from "./_components/sidebar";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Loading from "@/app/_components/loading";
import { Route } from "next";
import { Empty, EmptyContent, EmptyDescription } from "@/app/_components/ui/empty";
import { useGetSimulationByIdQuery } from "../_hooks/use-queries";
import { isNotFoundError } from "@/common/exception/helper";
import { Dialog } from "@/app/_components/ui/dialog";
import { ConstraintsFormDialog } from "./_components/dialog";
import { EVENT_TYPES, eventHandlers, parseEventData } from "@/lib/events";
import { useQueryClient } from "@tanstack/react-query";
import { useGetFinalRoutesQuery } from "./_hooks/use-queries";

const Map = dynamic(() => import("./_components/map"), {
  loading: () => <Loading />,
  ssr: false,
});

export default function SimulationDetailPage() {
  const { id: simulationId } = useParams<{ id: string }>();
  const { setBreadcrumbs } = useBreadcrumb();
  const { data, isLoading, error } = useGetSimulationByIdQuery(simulationId);
  const { data: finalRoutesData } = useGetFinalRoutesQuery(simulationId);
  const queryClient = useQueryClient();

  if (isNotFoundError(error)) {
    notFound();
  }

  useEffect(() => {
    const es = new EventSource("/api/events/stream");

    const handlers = EVENT_TYPES.map((eventType) => {
      const handler = (event: MessageEvent<string>) => {
        const payload = parseEventData(event.data);
        eventHandlers[eventType]?.({ queryClient, payload, simulationId });
      };

      es.addEventListener(eventType, handler);
      return { eventType, handler };
    });

    return () => {
      handlers.forEach(({ eventType, handler }) => {
        es.removeEventListener(eventType, handler);
      });
      es.close();
    };
  }, [queryClient, simulationId]);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Simulations",
        href: "/simulations",
      },
      {
        label: "Visualization",
        href: `/simulations/${simulationId}` as Route,
      },
    ]);
  }, [setBreadcrumbs, simulationId]);

  const isShowEmptyState = !isLoading && data?.data.status === "failed";

  return (
    <Dialog>
      <SimulationsLayoutShell
        leftSidebar={
          <SimulationDetailLeftSidebar
            hasUploadedCSV={!!data?.data.uploadId}
            status={data?.data.status}
          />
        }
        rightSidebar={<SimulationDetailRightSidebar data={data?.data} />}
        isLoading={isLoading}
      >
        {isShowEmptyState && (
          <Empty>
            <EmptyContent>
              <EmptyDescription>
                Visualization for this simulation is not available yet. Please check back later.
              </EmptyDescription>
            </EmptyContent>
          </Empty>
        )}
        {!isShowEmptyState && data?.data.depot && (
          <Map
            center={[data.data.depot.longitude, data.data.depot.latitude]}
            zoom={18}
            routes={finalRoutesData?.data}
          />
        )}
      </SimulationsLayoutShell>

      <ConstraintsFormDialog />
    </Dialog>
  );
}
