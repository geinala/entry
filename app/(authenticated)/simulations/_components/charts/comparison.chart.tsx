import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import SummaryContainer from "../summary-container";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useGetComparisonChartQuery } from "../../_hooks/use-queries";
import { formatSeconds, truncateText } from "@/lib/utils";

const chartConfig = {
  greedyInitial: {
    label: "Greedy Initial",
    color: "var(--color-greedy-baseline)",
  },
  greedyFinal: {
    label: "Greedy Final",
    color: "var(--color-greedy-final)",
  },
  tabuSearchInitial: {
    label: "Tabu Search Initial",
    color: "var(--color-tabu-search-baseline)",
  },
  tabuSearchFinal: {
    label: "Tabu Search Final",
    color: "var(--color-tabu-search-final)",
  },
} satisfies ChartConfig;

export const ComparisonChart = ({ simulationId }: { simulationId?: string }) => {
  const { data } = useGetComparisonChartQuery(simulationId);

  return (
    <SummaryContainer
      title="Comparison Chart"
      description="This chart compares the performance of the Tabu Search and Greedy algorithms over time. It shows how the solution quality evolves as the algorithms progress, allowing you to visually assess their convergence behavior and effectiveness in finding optimal or near-optimal solutions."
    >
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid vertical />
          <XAxis
            dataKey="courierName"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => truncateText(value, 15)}
          />
          <ChartTooltip
            cursor
            content={
              <ChartTooltipContent
                formatter={(value, name) => {
                  const config = {
                    greedyBaselineTime: {
                      label: "Greedy Initial",
                      color: "var(--color-greedy-baseline)",
                    },
                    greedyFinalTime: {
                      label: "Greedy Final",
                      color: "var(--color-greedy-final)",
                    },
                    tabuBaselineTime: {
                      label: "Tabu Search Initial",
                      color: "var(--color-tabu-search-baseline)",
                    },
                    tabuFinalTime: {
                      label: "Tabu Search Final",
                      color: "var(--color-tabu-search-final)",
                    },
                  }[String(name)];

                  return (
                    <div className="grid grid-cols-[auto_1fr_auto] gap-3 w-full items-center">
                      <div
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: config?.color }}
                      />
                      <div>{config?.label ?? name}</div>
                      <div className="font-medium">{formatSeconds(Number(value))}</div>
                    </div>
                  );
                }}
              />
            }
          />
          <Bar dataKey="greedyBaselineTime" fill="var(--color-greedy-baseline)" radius={4} />
          <Bar dataKey="greedyFinalTime" fill="var(--color-greedy-final)" radius={4} />
          <Bar dataKey="tabuBaselineTime" fill="var(--color-tabu-search-baseline)" radius={4} />
          <Bar dataKey="tabuFinalTime" fill="var(--color-tabu-search-final)" radius={4} />
        </BarChart>
      </ChartContainer>
    </SummaryContainer>
  );
};
