"use client";

import { SidebarProvider } from "@/app/_components/ui/sidebar";
import { ReactNode } from "react";
import { SimulationHistorySidebar } from "./_components/history-sidebar";
import Page from "@/app/_components/page";
import { OpenSimulationButton, DeleteSimulationButton } from "./_components/button";
import SimulationStatus from "./_components/status";

export default function SimulationHistoryLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="grid grid-cols-[300px_1fr] h-full w-full">
        <SimulationHistorySidebar />
        <Page
          title="History"
          description="This is your simulation history detail."
          headerAction={
            <div className="flex gap-2 items-end h-full">
              <DeleteSimulationButton />
              <OpenSimulationButton />
              <SimulationStatus />
            </div>
          }
        >
          {children}
        </Page>
      </div>
    </SidebarProvider>
  );
}
