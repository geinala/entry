"use client";

import SimulationsLayoutShell from "../_components/layout-shell";
import { SimulationDetailLeftSidebar, SimulationDetailRightSidebar } from "./_components/sidebar";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import TomTomMap from "./_components/tomtom-map";

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
        href: `/simulations/${params.id}`,
      },
    ]);
  }, [setBreadcrumbs, params.id]);

  return (
    <SimulationsLayoutShell
      leftSidebar={<SimulationDetailLeftSidebar />}
      rightSidebar={<SimulationDetailRightSidebar />}
    >
      <TomTomMap />
      {/* <div className="w-full h-full flex justify-center items-center">
        <Paragraph>This is the simulation detail page.</Paragraph>
      </div> */}
    </SimulationsLayoutShell>
  );
}
