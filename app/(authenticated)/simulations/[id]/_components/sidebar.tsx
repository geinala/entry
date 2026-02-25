"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/app/_components/ui/sidebar";
import CSVInput from "./input";
import { Separator } from "@/app/_components/ui/separator";
import { ChartNoAxesCombined } from "lucide-react";
import { Paragraph } from "@/app/_components/typography";
import StatItem from "./item";
import { StartButton } from "./button";
import { TSimulationStatus } from "@/types/database";

interface SimulationDetailSidebarLeftProps {
  hasUploadedCSV: boolean;
  status?: TSimulationStatus;
}

export const SimulationDetailLeftSidebar = ({
  hasUploadedCSV,
  status,
}: SimulationDetailSidebarLeftProps) => {
  return (
    <Sidebar containerClassName="relative h-full" className="h-full relative w-full" side="left">
      <SidebarContent className="p-4">
        {!hasUploadedCSV ? (
          <>
            <CSVInput />
            <Separator />
          </>
        ) : (
          <StartButton />
        )}
        <StatItem status={status} /> {/* TODO: Replace with dynamic status */}
      </SidebarContent>
    </Sidebar>
  );
};

export const SimulationDetailRightSidebar = () => {
  return (
    <Sidebar containerClassName="relative h-full" className="h-full relative w-full" side="right">
      <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-4">
        <ChartNoAxesCombined className="w-5 h-5 text-primary" />
        <Paragraph className="not-first:mt-0 text-md font-semibold">Results</Paragraph>
      </SidebarHeader>
      <SidebarSeparator className="m-0" />
      <SidebarContent>
        <div className="grid grid-cols-2 gap-3 p-3"></div>
      </SidebarContent>
    </Sidebar>
  );
};
