"use client";

import SimulationsLayoutShell from "../_components/layout-shell";
import { SimulationDetailLeftSidebar, SimulationDetailRightSidebar } from "./_components/sidebar";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Loading from "@/app/_components/loading";
import { Route } from "next";

const TomTomMap = dynamic(() => import("./_components/tomtom-map"), {
  loading: () => <Loading />,
  ssr: false,
});

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
