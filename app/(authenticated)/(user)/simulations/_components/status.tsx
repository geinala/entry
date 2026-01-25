"use client";

import { Item, ItemContent, ItemMedia, ItemTitle } from "@/app/_components/ui/item";
import { CircleCheck, Clock, X } from "lucide-react";

// TODO: Adjust according to actual status types and icons
const statusConfig = {
  completed: {
    label: "Completed",
    icon: CircleCheck,
    colorClass: "text-green-600",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    colorClass: "text-yellow-600",
  },
  failed: {
    label: "Failed",
    icon: X,
    colorClass: "text-red-600",
  },
};

interface SimulationStatusProps {
  status?: "completed" | "pending" | "failed"; // TODO: Adjust according to actual status types
}

export default function SimulationStatus({ status = "completed" }: SimulationStatusProps) {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <Item variant={"outline"} size={"sm"}>
      <ItemMedia>
        <IconComponent className={config.colorClass} />
      </ItemMedia>
      <ItemContent>
        {/** TODO: Change with actual simulation status */}
        <ItemTitle className={config.colorClass}>{config.label}</ItemTitle>
      </ItemContent>
    </Item>
  );
}
