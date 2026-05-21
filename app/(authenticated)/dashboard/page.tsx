"use client";

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/app/_components/ui/empty";
import { useBreadcrumb } from "@/app/_contexts/breadcrumb.context";
import { useEffect } from "react";

export default function DashboardPage() {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs([
      {
        label: "Dashboard",
        href: "/dashboard",
      },
    ]);
  }, [setBreadcrumbs]);

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-3">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Dashboard</EmptyTitle>
          <EmptyDescription>
            Welcome to the dashboard! This is where you can find an overview of your activities and
            insights.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
