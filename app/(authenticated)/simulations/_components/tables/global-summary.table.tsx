"use client";

import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useGetGlobalSummaryAlgorithmQuery } from "../../_hooks/use-queries";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/app/_components/ui/table";
import { formatSeconds, metersToKm } from "@/lib/utils";
import { useGetAllCouriersQuery } from "../../[id]/_hooks/use-queries";
import CourierSelect from "../courier.select";
import SummaryContainer from "../summary-container";

interface ILogTable {
  simulationId: string;
}

export default function GlobalSummaryTable({ simulationId }: ILogTable) {
  const [selectedCourierId, setSelectedCourierId] = useState<string>("all");
  const courierIdForQuery = selectedCourierId === "all" ? undefined : selectedCourierId;

  const { data } = useGetGlobalSummaryAlgorithmQuery(simulationId, courierIdForQuery);
  const { data: couriersData, isLoading } = useGetAllCouriersQuery(simulationId);

  const handleCourierChange = (courierId: string) => {
    setSelectedCourierId(courierId);
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
        <CourierSelect
          couriers={couriersData ?? []}
          isLoading={isLoading}
          value={selectedCourierId}
          onValueChange={handleCourierChange}
        />
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
          <TableRow>
            <TableCell>Total Nodes Explored</TableCell>
            <TableCell colSpan={2} className="text-center font-medium">
              {data?.totalNodesExplored ?? "-"}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SummaryContainer>
  );
}
