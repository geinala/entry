"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { TOptimizationSummaryParams } from "@/schemas/simulations/optimization-summary.schema";

interface SummaryTypeSelectProps {
  value: TOptimizationSummaryParams["summaryType"];
  onValueChange: (value: TOptimizationSummaryParams["summaryType"]) => void;
  className?: string;
}

export default function SummaryTypeSelect({
  value,
  onValueChange,
  className = "w-56",
}: SummaryTypeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Summary Type" />
      </SelectTrigger>

      <SelectContent position="popper">
        <SelectItem value="initial">Initial</SelectItem>
        <SelectItem value="final">Final Result</SelectItem>
      </SelectContent>
    </Select>
  );
}
