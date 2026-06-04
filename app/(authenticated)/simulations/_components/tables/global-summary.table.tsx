"use client";

import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useGetGlobalSummaryAlgorithmQuery } from "../../_hooks/use-queries";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/app/_components/ui/table";
import { formatSeconds, metersToKm } from "@/lib/utils";
import { useGetAllCouriersQuery } from "../../[id]/_hooks/use-queries";
import CourierSelect from "../courier.select";
import SummaryContainer from "../summary-container";
import { TOptimizationSummaryParams } from "@/schemas/simulations/optimization-summary.schema";
import SummaryTypeSelect from "../summary-type.select";

interface ILogTable {
  simulationId: string;
}

export default function GlobalSummaryTable({ simulationId }: ILogTable) {
  const [selectedCourierId, setSelectedCourierId] = useState<string>("all");
  const [summaryType, setSummaryType] =
    useState<TOptimizationSummaryParams["summaryType"]>("initial");
  const courierIdForQuery = selectedCourierId === "all" ? undefined : selectedCourierId;

  const { data } = useGetGlobalSummaryAlgorithmQuery(simulationId, {
    courierId: Number(courierIdForQuery) || undefined,
    summaryType,
  });
  const { data: couriersData, isLoading } = useGetAllCouriersQuery(simulationId);

  const handleCourierChange = (courierId: string) => {
    setSelectedCourierId(courierId);
  };

  const handleSummaryTypeChange = (type: TOptimizationSummaryParams["summaryType"]) => {
    setSummaryType(type);
  };

  const renderImprovement = (value?: number) => {
    if (value === undefined || value === null) return "-";

    const formattedValue = `${value.toFixed(2)}%`;
    if (value > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-green-600">
          <TrendingUp className="h-4 w-4" />
          {formattedValue}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-red-600">
          <TrendingDown className="h-4 w-4" />
          {formattedValue}
        </span>
      );
    }
  };

  return (
    <SummaryContainer
      title="Global Summary"
      description="Summary of algorithm performance metrics."
      icon={<Calculator className="text-primary w-full h-full" />}
      headerRight={
        <div className="flex gap-2">
          <SummaryTypeSelect onValueChange={handleSummaryTypeChange} value={summaryType} />
          <CourierSelect
            couriers={couriersData ?? []}
            isLoading={isLoading}
            value={selectedCourierId}
            onValueChange={handleCourierChange}
          />
        </div>
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-medium">Metric</TableCell>
            <TableCell className="font-medium">Greedy</TableCell>
            <TableCell className="font-medium">Tabu Search</TableCell>
            <TableCell className="font-medium">Improvement</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Total Distance</TableCell>
            <TableCell>
              {data?.greedySummary
                ? `${metersToKm(data.greedySummary.totalDistanceInMeters)} km`
                : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchSummary
                ? `${metersToKm(data.tabuSearchSummary.totalDistanceInMeters)} km`
                : "-"}
            </TableCell>
            <TableCell>
              {renderImprovement(data?.improvement?.totalDistanceImprovementPercentage)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Travel Time</TableCell>
            <TableCell>
              {data?.greedySummary
                ? formatSeconds(data.greedySummary.totalTimeTravelledInSeconds, [
                    "hours",
                    "minutes",
                    "seconds",
                  ])
                : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchSummary
                ? formatSeconds(data.tabuSearchSummary.totalTimeTravelledInSeconds, [
                    "hours",
                    "minutes",
                    "seconds",
                  ])
                : "-"}
            </TableCell>
            <TableCell>
              {renderImprovement(data?.improvement?.totalTimeTravelledImprovementPercentage)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Computation Time</TableCell>
            <TableCell>
              {data?.greedySummary
                ? `${data.greedySummary.computationTimeInMs.toFixed(2)} ms`
                : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchSummary
                ? `${data.tabuSearchSummary.computationTimeInMs.toFixed(2)} ms`
                : "-"}
            </TableCell>
            <TableCell>
              {renderImprovement(data?.improvement?.computationTimeImprovementPercentage)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SummaryContainer>
  );
}
