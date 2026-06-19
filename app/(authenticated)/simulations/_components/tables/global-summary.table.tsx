"use client";

import { Calculator } from "lucide-react";
import { useState } from "react";
import { useGetGlobalSummaryAlgorithmQuery } from "../../_hooks/use-queries";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/app/_components/ui/table";
import { formatSeconds, metersToKm } from "@/lib/utils";
import { useGetAllCouriersQuery } from "../../[id]/_hooks/use-queries";
import CourierSelect from "../courier.select";
import SummaryContainer from "../summary-container";
import { TOptimizationSummaryParams } from "@/schemas/simulations/optimization-summary.schema";

interface ILogTable {
  simulationId: string;
}

export default function GlobalSummaryTable({ simulationId }: ILogTable) {
  const [selectedCourierId, setSelectedCourierId] = useState<string>("all");
  const [summaryType] = useState<TOptimizationSummaryParams["summaryType"]>("initial");
  const courierIdForQuery = selectedCourierId === "all" ? undefined : selectedCourierId;

  const { data } = useGetGlobalSummaryAlgorithmQuery(simulationId, {
    courierId: Number(courierIdForQuery) || undefined,
    summaryType,
  });
  const { data: couriersData, isLoading } = useGetAllCouriersQuery(simulationId);

  const handleCourierChange = (courierId: string) => {
    setSelectedCourierId(courierId);
  };

  return (
    <SummaryContainer
      title="Global Summary"
      description="Summary of algorithm performance metrics."
      icon={<Calculator className="text-primary w-full h-full" />}
      headerRight={
        <div className="flex gap-2">
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
            <TableCell className="font-medium">Greedy Initial</TableCell>
            <TableCell className="font-medium">Greedy Final</TableCell>
            <TableCell className="font-medium">Tabu Search Initial</TableCell>
            <TableCell className="font-medium">Tabu Search Final</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Total Distance</TableCell>
            <TableCell>
              {data?.greedyInitial
                ? `${metersToKm(data.greedyInitial.totalDistanceInMeters)} km`
                : "-"}
            </TableCell>
            <TableCell>
              {data?.greedyFinal ? `${metersToKm(data.greedyFinal.totalDistanceInMeters)} km` : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchInitial
                ? `${metersToKm(data.tabuSearchInitial.totalDistanceInMeters)} km`
                : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchFinal
                ? `${metersToKm(data.tabuSearchFinal.totalDistanceInMeters)} km`
                : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Travel Time</TableCell>
            <TableCell>
              {data?.greedyInitial
                ? formatSeconds(data.greedyInitial.totalTimeTravelledInSeconds, [
                    "hours",
                    "minutes",
                    "seconds",
                  ])
                : "-"}
            </TableCell>
            <TableCell>
              {data?.greedyFinal
                ? formatSeconds(data.greedyFinal.totalTimeTravelledInSeconds, [
                    "hours",
                    "minutes",
                    "seconds",
                  ])
                : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchInitial
                ? formatSeconds(data.tabuSearchInitial.totalTimeTravelledInSeconds, [
                    "hours",
                    "minutes",
                    "seconds",
                  ])
                : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchFinal
                ? formatSeconds(data.tabuSearchFinal.totalTimeTravelledInSeconds, [
                    "hours",
                    "minutes",
                    "seconds",
                  ])
                : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Computation Time</TableCell>
            <TableCell>
              {data?.greedyInitial
                ? `${data.greedyInitial.computationTimeInMs.toFixed(2)} ms`
                : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchFinal
                ? `${data.tabuSearchFinal.computationTimeInMs.toFixed(2)} ms`
                : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchInitial
                ? `${data.tabuSearchInitial.computationTimeInMs.toFixed(2)} ms`
                : "-"}
            </TableCell>
            <TableCell>
              {data?.tabuSearchFinal
                ? `${data.tabuSearchFinal.computationTimeInMs.toFixed(2)} ms`
                : "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </SummaryContainer>
  );
}
