import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/app/_components/ui/sidebar";
import CSVInput from "./input";
import StartButton from "./button";
import { Separator } from "@/app/_components/ui/separator";
import { ChartNoAxesCombined } from "lucide-react";
import { Paragraph, Title } from "@/app/_components/typography";
import StatItem from "./item";
import { ItemContent } from "@/app/_components/ui/item";

export const SimulationDetailLeftSidebar = () => {
  return (
    <Sidebar containerClassName="relative h-full" className="h-full relative w-full" side="left">
      <SidebarContent className="p-4">
        <CSVInput />
        <StartButton />
        <Separator />
        <StatItem title="Status" value="All systems operational" />
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
        <div className="grid grid-cols-2 gap-3 p-3">
          <StatItem
            title="Distance"
            value={
              <div className="flex flex-row items-baseline gap-0.5">
                <Title level={4}>123</Title>
                km
              </div>
            }
            className="h-fit gap-1!"
            showIndicator={false}
          />
          <StatItem
            title="Time"
            value={
              <div className="flex flex-row items-baseline gap-2">
                <span className="flex flex-row items-baseline gap-0.5">
                  <Title level={4}>2</Title>h
                </span>
                <span className="flex flex-row items-baseline gap-0.5">
                  <Title level={4}>30</Title>m
                </span>
              </div>
            }
            className="h-fit gap-1!"
            showIndicator={false}
          />
          <StatItem
            title="Vehicles Used"
            value={
              <ItemContent className="flex flex-row justify-between items-center">
                <Title level={3}>5</Title>
              </ItemContent>
            }
            className="h-fit col-span-2 flex flex-row justify-between items-center gap-1!"
            showIndicator={false}
          />
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
