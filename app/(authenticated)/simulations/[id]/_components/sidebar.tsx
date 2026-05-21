"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/app/_components/ui/sidebar";
import { ChartNoAxesCombined } from "lucide-react";
import { Paragraph, Title } from "@/app/_components/typography";
import { SimulationStatusItem, StatisticsItem } from "./item";
import { TSimulation, TSimulationStatus } from "@/types/database";
import { formatSeconds, metersToKm } from "@/lib/utils";
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
        <div className="flex flex-col px-3 gap-2 pt-2">
          <Title level={6}>Overall Statistics</Title>
          <div className="grid grid-cols-2 gap-2">
            <StatisticsItem
              title="Distance"
              content={
                <Paragraph className="text-xl font-medium">
                  {metersToKm(data?.totalDistanceInMeters ?? 0) ?? 0}
                  <span className="text-sm">km</span>
                </Paragraph>
              }
            />
            <StatisticsItem
              title="Time"
              content={
                <Paragraph className="text-xl font-medium">
                  {formatSeconds(data?.totalDurationInSeconds ?? 0, ["hours", "minutes"])}
                </Paragraph>
              }
            />
            <div className="col-span-2">
              <StatisticsItem
                title="Total Demand"
                content={
                  <Paragraph className="text-xl font-medium">
                    {/* {data?.totalDemandInKilograms.toFixed(2) ?? 0} */}
                    <span className="text-sm">kg</span>
                  </Paragraph>
                }
              />
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
