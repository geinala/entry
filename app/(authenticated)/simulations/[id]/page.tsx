"use client";

import SimulationsLayoutShell from "../_components/layout-shell";
import { SimulationDetailLeftSidebar, SimulationDetailRightSidebar } from "./_components/sidebar";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Loading from "@/app/_components/loading";
import { Route } from "next";
import { Empty, EmptyContent, EmptyDescription } from "@/app/_components/ui/empty";
import { useGetSimulationByIdQuery } from "../_hooks/use-queries";

const TomTomMap = dynamic(() => import("./_components/tomtom-map"), {
  loading: () => <Loading />,
  ssr: false,
});

export default function SimulationDetailPage() {
  const { id: simulationId } = useParams<{ id: string }>();
  const { setBreadcrumbs } = useBreadcrumb();
  const { data, isLoading } = useGetSimulationByIdQuery(simulationId);

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

  return (
    <SimulationsLayoutShell
      leftSidebar={<SimulationDetailLeftSidebar hasUploadedCSV={!!data?.data.uploadId} />}
      rightSidebar={<SimulationDetailRightSidebar />}
      isLoading={isLoading}
    >
      {/* <TomTomMap /> */}
      <Empty>
        <EmptyContent>
          <EmptyDescription>
            Visualization for this simulation is not available yet. Please check back later.
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </SimulationsLayoutShell>
  );
}
