"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/app/_components/ui/sidebar";
import { ChartNoAxesCombined } from "lucide-react";
import { Paragraph } from "@/app/_components/typography";
import { SimulationStatusItem } from "./item";
import { TSimulation, TSimulationStatus } from "@/types/database";
import { CourierSelect } from "./courier.select";

interface SimulationDetailSidebarLeftProps {
  status?: TSimulationStatus;
}

export const SimulationDetailLeftSidebar = ({ status }: SimulationDetailSidebarLeftProps) => {
  return (
    <Sidebar containerClassName="relative h-full" className="h-full relative w-full" side="left">
      <SidebarContent className="p-3">
        <SimulationStatusItem status={status} />
      </SidebarContent>
    </Sidebar>
  );
};

interface RightSidebarProps {
  data?: TSimulation;
}

export const SimulationDetailRightSidebar = ({ data }: RightSidebarProps) => {
  return (
    <Sidebar containerClassName="relative h-full" className="h-full relative w-full" side="right">
      <SidebarHeader className="flex flex-row items-center gap-2 p-3">
        <ChartNoAxesCombined className="w-5 h-5 text-primary" />
        <Paragraph className="not-first:mt-0 text-md font-semibold">Results</Paragraph>
      </SidebarHeader>
      <SidebarSeparator className="m-0" />
      <SidebarContent>
        <CourierSelect totalActiveCouriers={data?.totalActiveCouriers} />
      </SidebarContent>
    </Sidebar>
  );
};
