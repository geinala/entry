"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import SummaryContainer from "../summary-container";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useGetTimeSeriesSummaryQuery } from "../../_hooks/use-queries";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { formatSeconds } from "@/lib/utils";
import CourierSelect from "../courier.select";
import { useGetAllCouriersQuery } from "../../[id]/_hooks/use-queries";
import { ChartLine } from "lucide-react";

const chartConfig = {} satisfies ChartConfig;

interface Props {
  simulationId: string;
}

export const TimeTravelChart = ({ simulationId }: Props) => {
  const [selectedCourierId, setSelectedCourierId] = useState<string | null>(null);

  const { data: couriersData, isLoading } = useGetAllCouriersQuery(simulationId);

  const effectiveCourierId = selectedCourierId ?? couriersData?.[0]?.id?.toString() ?? null;

  const { data } = useGetTimeSeriesSummaryQuery(simulationId, {
    summaryType: "initial",
    courierId: Number(effectiveCourierId),
  });

  const mappedData: { time: string; tabuSearch: number; greedy: number }[] = useMemo(() => {
    if (!data) return [];

    return data.map((entry) => ({
      time: format(new Date(entry.triggeredAt), "HH:mm"),
      tabuSearch: entry.tabuTime,
      greedy: entry.greedyTime,
    }));
  }, [data]);

  const handleCourierChange = (courierId: string) => {
    setSelectedCourierId(courierId);
  };

  return (
    <SummaryContainer
      title="Courier Travel Time Timeline"
      description="Travel time progression for Greedy and Tabu Search after each reoptimization event"
      icon={<ChartLine className="text-primary" />}
      headerRight={
        <CourierSelect
          couriers={couriersData ?? []}
          isLoading={isLoading}
          value={effectiveCourierId ?? ""}
          onValueChange={handleCourierChange}
          isWithAllOption={false}
        />
      }
    >
      <ChartContainer config={chartConfig} className="w-full max-h-175">
        <LineChart
          accessibilityLayer
          data={mappedData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical />
          <XAxis dataKey="time" tickLine axisLine={false} tickMargin={8} />
          <YAxis tickFormatter={(value) => formatSeconds(value)} axisLine={false} />
          <ChartTooltip
            cursor={true}
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div className="grid grid-cols-[auto_1fr_1fr] gap-3 w-full items-center">
                    <div
                      className={`w-2.5 h-2.5 rounded-sm ${name === "tabuSearch" ? "bg-(--color-tabu-search-final)" : "bg-(--color-greedy-final)"}`}
                    />
                    <div>{name === "tabuSearch" ? "Tabu Search Time" : "Greedy Time"}</div>
                    <div className="flex-1 font-medium">{formatSeconds(Number(value))}</div>
                  </div>
                )}
              />
            }
          />
          <Line
            dataKey="tabuSearch"
            type="monotone"
            stroke="var(--color-tabu-search-final)"
            strokeWidth={2}
            dot
          />
          <Line
            dataKey="greedy"
            type="monotone"
            stroke="var(--color-greedy-final)"
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ChartContainer>
    </SummaryContainer>
  );
};
