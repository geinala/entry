"use client";

import Loading from "@/app/_components/loading";
import { SidebarProvider } from "@/app/_components/ui/sidebar";
import { PropsWithChildren } from "react";

interface Props {
  leftSidebar: React.ReactNode;
  rightSidebar?: React.ReactNode;
  isLoading?: boolean;
}

export default function SimulationsLayoutShell({
  leftSidebar,
  rightSidebar,
  children,
  isLoading = false,
}: PropsWithChildren<Props>) {
  const gridColsClass = rightSidebar ? "grid-cols-[300px_1fr_300px]" : "grid-cols-[300px_1fr]";

  if (isLoading) return <Loading />;

  return (
    <SidebarProvider defaultOpen>
      <div className={`grid ${gridColsClass} h-full w-full gap-0`}>
        {leftSidebar}
        {children}
        {rightSidebar}
      </div>
    </SidebarProvider>
  );
}
