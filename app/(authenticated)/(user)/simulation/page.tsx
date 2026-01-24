"use client";

import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";

export default function SimulationPage() {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "History",
        href: "/simulation/history",
      },
      { label: "Simulation", href: "/simulation" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-4">
      <h1>Hallo! Ini Halaman Simulation</h1>
      {/* <TomTomMap /> */}
    </div>
  );
}
