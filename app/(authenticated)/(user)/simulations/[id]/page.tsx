"use client";

import SimulationsLayoutShell from "../_components/layout-shell";
import { SimulationDetailLeftSidebar, SimulationDetailRightSidebar } from "./_components/sidebar";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import TomTomMap from "./_components/tomtom-map";
import { Route } from "next";

export default function SimulationDetailPage() {
  const params = useParams();
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Simulations",
        href: "/simulations",
      },
      {
        label: "Visualization",
        href: `/simulations/${params.id}` as Route,
      },
    ]);
  }, [setBreadcrumbs, params.id]);

  return (
    <SimulationsLayoutShell
      leftSidebar={<SimulationDetailLeftSidebar />}
      rightSidebar={<SimulationDetailRightSidebar />}
    >
      <TomTomMap />
    </SimulationsLayoutShell>
  );
}
