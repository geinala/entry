"use client";

import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect, useState } from "react";
import {
  TotalActiveCouriersCard,
  TotalCompletedNodesCard,
  TotalDistanceCard,
  TotalTimeTravelCard,
} from "./_components/card";
import Page from "@/app/_components/page";
import {
  DeleteSimulationButton,
  OpenSimulationButton,
  RefreshSimulationDetailsButton,
} from "./_components/button";
import SimulationStatus from "./_components/status";
import SimulationsLayoutShell from "./_components/layout-shell";
import { SimulationHistorySidebar } from "./_components/sidebar";
import { useGetSimulationByIdQuery } from "./_hooks/use-queries";
import { Empty, EmptyContent, EmptyDescription } from "@/app/_components/ui/empty";
import Link from "next/link";
import { formatSeconds, metersToKm } from "@/lib/utils";
import { Paragraph } from "@/app/_components/typography";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import GlobalSummaryTable from "./_components/tables/global-summary.table";
import ReoptimizationEventsTable from "./_components/tables/reoptimization-events.table";
import { TimeTravelChart } from "./_components/charts/time-travel.chart";
import { ComparisonChart } from "./_components/charts/comparison.chart";

const SHORTCUT_KEY_TO_REMOVE_DETAILS = "Escape";

export default function HistoryPage() {
  const { setBreadcrumbs } = useBreadcrumb();
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
    <SimulationsLayoutShell
      leftSidebar={
        <SimulationHistorySidebar
          onSelectSimulation={(simulationId) => setSelectedSimulationId(simulationId)}
        />
      }
    >
      {selectedSimulationId && data ? (
        <Page
          title={`${data.title} - Simulation Details`}
          isLoading={isLoading}
          description="This is your simulation history detail."
          headerAction={
            <div className="flex gap-2 items-end h-full">
              <DeleteSimulationButton
                simulationId={selectedSimulationId}
                onDeleted={() => setSelectedSimulationId(undefined)}
              />
              <Link href={`/simulations/${selectedSimulationId}`}>
                <OpenSimulationButton />
              </Link>
              <RefreshSimulationDetailsButton />
              <SimulationStatus status={data.status} />
            </div>
          }
        >
          <main className="flex-1 overflow-y-auto min-h-0">
            <div className="flex flex-col gap-3">
              <section className="flex gap-3 w-full">
                <TotalDistanceCard
                  content={
                    <Paragraph className="font-medium text-2xl">
                      {data.finalTotalDistanceInMeters
                        ? metersToKm(data.finalTotalDistanceInMeters)
                        : metersToKm(data.initialTotalDistanceInMeters)}{" "}
                      km
                    </Paragraph>
                  }
                  footer={
                    <>
                      <Clock className="text-muted-foreground w-3 h-3 mr-1" />
                      <Paragraph className="text-muted-foreground">
                        Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}
                      </Paragraph>
                    </>
                  }
                />
                <TotalTimeTravelCard
                  content={
                    <Paragraph className="font-medium text-2xl">
                      {formatSeconds(
                        data.finalTotalDurationInSeconds || data.initialTotalDurationInSeconds,
                        ["hours", "minutes"],
                      )}
                    </Paragraph>
                  }
                  footer={
                    <>
                      <Clock className="text-muted-foreground w-3 h-3 mr-1" />
                      <Paragraph className="text-muted-foreground">
                        Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}
                      </Paragraph>
                    </>
                  }
                />
                <TotalActiveCouriersCard
                  content={
                    <Paragraph className="font-medium text-2xl">
                      {data.totalActiveCouriers} couriers
                    </Paragraph>
                  }
                  footer={
                    <>
                      <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                      <Paragraph className="text-muted-foreground">
                        Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}
                      </Paragraph>
                    </>
                  }
                />
                <TotalCompletedNodesCard
                  content={
                    <Paragraph className="font-medium text-2xl">
                      {data.totalCompletedNodes} nodes
                    </Paragraph>
                  }
                  footer={
                    <>
                      <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                      <Paragraph className="text-muted-foreground">
                        Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}
                      </Paragraph>
                    </>
                  }
                />
              </section>
              <section className="w-full h-full flex flex-col gap-3">
                <GlobalSummaryTable simulationId={selectedSimulationId} />
                <ReoptimizationEventsTable simulationId={selectedSimulationId} />
                <TimeTravelChart simulationId={selectedSimulationId} />
                <ComparisonChart simulationId={selectedSimulationId} />
              </section>
            </div>
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
  );
}
