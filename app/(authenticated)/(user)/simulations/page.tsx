"use client";

import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import {
  TotalActiveVehiclesCard,
  TotalCompletedNodesCard,
  TotalDistanceCard,
  TotalTimeTravelCard,
} from "./_components/card";
import LogTable from "./_components/table";
import Page from "@/app/_components/page";
import { DeleteSimulationButton, OpenSimulationButton } from "./_components/button";
import SimulationStatus from "./_components/status";
import SimulationsLayoutShell from "./_components/layout-shell";
import { SimulationHistorySidebar } from "./_components/sidebar";

export default function HistoryPage() {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Simulations",
        href: "/simulations",
      },
    ]);
  }, [setBreadcrumbs]);

  return (
    <SimulationsLayoutShell leftSidebar={<SimulationHistorySidebar />}>
      <Page
        title="Simulations"
        description="This is your simulation history detail."
        headerAction={
          <div className="flex gap-2 items-end h-full">
            <DeleteSimulationButton />
            <OpenSimulationButton />
            <SimulationStatus />
          </div>
        }
      >
        <main className="flex flex-col gap-4">
          <section className="flex gap-3 w-full">
            <TotalDistanceCard />
            <TotalTimeTravelCard />
            <TotalActiveVehiclesCard />
            <TotalCompletedNodesCard />
          </section>
          <section>
            <LogTable />
          </section>
        </main>
      </Page>
    </SimulationsLayoutShell>
  );
}
