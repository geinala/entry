"use client";

import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect, useState } from "react";
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
import { Dialog } from "@/app/_components/ui/dialog";
import { CreateSimulationFormDialog } from "./_components/forms/create-simulation.form";
import { GuardComponent } from "@/app/_components/guard";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { useGetSimulationByIdQuery } from "./_hooks/use-queries";
import { Empty, EmptyContent, EmptyDescription } from "@/app/_components/ui/empty";
import Link from "next/link";

const SHORTCUT_KEY_TO_REMOVE_DETAILS = "Escape";

export default function HistoryPage() {
  const { setBreadcrumbs } = useBreadcrumb();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSimulationId, setSelectedSimulationId] = useState<string>();
  const { data, isLoading } = useGetSimulationByIdQuery(selectedSimulationId);

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Simulations",
        href: "/simulations",
      },
    ]);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SHORTCUT_KEY_TO_REMOVE_DETAILS) {
        setSelectedSimulationId(undefined);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSimulationId]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <SimulationsLayoutShell
        leftSidebar={
          <SimulationHistorySidebar
            onSelectSimulation={(simulationId) => setSelectedSimulationId(simulationId)}
          />
        }
      >
        {selectedSimulationId && data ? (
          <Page
            title="Simulations"
            isLoading={isLoading}
            description="This is your simulation history detail."
            headerAction={
              <div className="flex gap-2 items-end h-full">
                <DeleteSimulationButton />
                <Link href={`/simulations/${selectedSimulationId}`}>
                  <OpenSimulationButton />
                </Link>
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
        ) : (
          <Page>
            <Empty>
              <EmptyContent>
                <EmptyDescription>No simulation selected</EmptyDescription>
              </EmptyContent>
            </Empty>
          </Page>
        )}
      </SimulationsLayoutShell>

      <GuardComponent requirePermission={PERMISSIONS.CREATE_SIMULATION}>
        <CreateSimulationFormDialog onSuccess={() => setIsDialogOpen(false)} />
      </GuardComponent>
    </Dialog>
  );
}
