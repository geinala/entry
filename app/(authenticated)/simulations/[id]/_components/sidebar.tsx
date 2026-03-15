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
import { Paragraph, Title } from "@/app/_components/typography";
import { SimulationStatusItem, StatisticsItem } from "./item";
import { SimulationFileUploadedItem } from "./file-status.item";
import { useGetFileWithSimulationIdQuery } from "../_hooks/use-queries";
import { useParams } from "next/navigation";
import { StartButton } from "./button";
import { TSimulation, TSimulationStatus } from "@/types/database";
import { VehicleSelect } from "./vehicle.select";

interface SimulationDetailSidebarLeftProps {
  hasUploadedCSV: boolean;
  status?: TSimulationStatus;
}

export const SimulationDetailLeftSidebar = ({
  hasUploadedCSV,
  status,
}: SimulationDetailSidebarLeftProps) => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetFileWithSimulationIdQuery(id, hasUploadedCSV);

  return (
    <Sidebar containerClassName="relative h-full" className="h-full relative w-full" side="left">
      <SidebarContent className="p-4">
        {!hasUploadedCSV ? (
          <>
            <CSVInput />
            <Separator />
          </>
        ) : (
          <>
            <SimulationFileUploadedItem data={data?.data} isLoading={isLoading} />
            {data?.data.uploadedFile?.status === "ready" && data?.data.status === "pending" && (
              <StartButton />
            )}
          </>
        )}
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
      <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-4">
        <ChartNoAxesCombined className="w-5 h-5 text-primary" />
        <Paragraph className="not-first:mt-0 text-md font-semibold">Results</Paragraph>
      </SidebarHeader>
      <SidebarSeparator className="m-0" />
      <SidebarContent>
        <VehicleSelect totalActiveVehicles={data?.totalActiveVehicles} />
        <div className="flex flex-col px-3 gap-2 pt-2">
          <Title level={6}>Overall Statistics</Title>
          <div className="grid grid-cols-2 gap-2">
            <StatisticsItem
              title="Distance"
              // TODO: change with real data
              content={
                <Paragraph className="text-xl font-medium">
                  100<span className="text-sm">km</span>
                </Paragraph>
              }
            />
            <StatisticsItem
              title="Time"
              // TODO: change with real data
              content={
                <Paragraph className="text-xl font-medium">
                  1<span className="text-sm">hour</span>
                </Paragraph>
              }
            />
            <div className="col-span-2">
              <StatisticsItem
                title="Total Demand"
                content={
                  <Paragraph className="text-xl font-medium">
                    {data?.totalDemandInKilograms.toFixed(2) ?? 0}
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
