"use client";

import { Item, ItemContent, ItemHeader, ItemTitle } from "@/app/_components/ui/item";
import { Indicator } from "../../_components/indicator";
import { Paragraph } from "@/app/_components/typography";
import { TSimulationStatus } from "@/types/database";

interface ISimulationStatusItemProps {
  status?: TSimulationStatus;
}

const SIMULATION_STATUS_COLOR_MAP = {
  optimizing: { color: "yellow", label: "Optimizing" },
  running: { color: "blue", label: "Running" },
  completed: { color: "green", label: "Completed" },
  failed: { color: "red", label: "Failed" },
} as const satisfies Record<TSimulationStatus, { color: string; label: string }>;

const getStatusConfig = (status: TSimulationStatus) => {
  return SIMULATION_STATUS_COLOR_MAP[status];
};

const SimulationStatusItem = ({ status }: ISimulationStatusItemProps) => {
  const statusConfig = status ? getStatusConfig(status) : undefined;

  return (
    <Item variant={"outline"} className={`gap-2 bg-muted`}>
      <ItemHeader>
        <ItemTitle className="text-muted-foreground">Status</ItemTitle>
      </ItemHeader>
      {statusConfig ? (
        <ItemContent className="flex flex-row items-center gap-2">
          <Indicator color={statusConfig.color} />
          <Paragraph className="not-first:mt-0 font-medium">{statusConfig.label}</Paragraph>
        </ItemContent>
      ) : (
        <Paragraph className="not-first:mt-0 font-medium">Unknown</Paragraph>
      )}
    </Item>
  );
};

export { SimulationStatusItem };
