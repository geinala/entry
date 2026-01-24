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

export default function HistoryPage() {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "History",
        href: "/simulation/history",
      },
    ]);
  }, [setBreadcrumbs]);

  return (
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
  );
}
