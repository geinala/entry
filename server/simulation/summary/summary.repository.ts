import {
  courierRouteTable,
  courierTable,
  optimizationRunTable,
  routeLegTable,
} from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TOptimizationSummaryParams } from "@/schemas/simulations/optimization-summary.schema";
import { TComparisonChartDataItem, TGlobalAlgorithmSummary } from "@/types/database";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";

export const getGlobalSummaryAlgorithmRepository = async (
  simulationId: string,
  queryParams: TOptimizationSummaryParams,
): Promise<Omit<TGlobalAlgorithmSummary, "improvement">> => {
  const summaryType = queryParams.summaryType ?? "initial";
  const courierId = queryParams.courierId ? Number(queryParams.courierId) : null;

  let optimizationScope;

  if (summaryType === "initial") {
    optimizationScope = sql`
      SELECT DISTINCT ON (o.courier_id, o.algorithm) o.id
      FROM optimization_runs o
      WHERE
        o.simulation_id = ${simulationId}
        AND o.run_type IN ('initial')
        ${courierId !== null ? sql`AND o.courier_id = ${courierId}` : sql``}
      ORDER BY o.courier_id, o.algorithm, o.triggered_at DESC
    `;
  } else {
    optimizationScope = sql`
      SELECT DISTINCT ON (o.courier_id, o.algorithm) o.id
      FROM optimization_runs o
      WHERE
        o.simulation_id = ${simulationId}
        AND o.run_type IN ('initial', 'reoptimization')
        ${courierId !== null ? sql`AND o.courier_id = ${courierId}` : sql``}
      ORDER BY o.courier_id, o.algorithm, o.triggered_at DESC
    `;
  }

  const [row] = await db
    .select({
      greedyTotalDistance: sql<number>`COALESCE(SUM(CASE WHEN o.algorithm = 'greedy' THEN o.total_distance_in_meters ELSE 0 END), 0)`,
      greedyTotalTravelTime: sql<number>`COALESCE(SUM(CASE WHEN o.algorithm = 'greedy' THEN o.total_travel_time_in_seconds ELSE 0 END), 0)`,
      greedyComputationTime: sql<number>`COALESCE(SUM(CASE WHEN o.algorithm = 'greedy' THEN o.computation_time_in_ms ELSE 0 END), 0)`,

      tabuTotalDistance: sql<number>`COALESCE(SUM(CASE WHEN o.algorithm = 'tabu_search' THEN o.total_distance_in_meters ELSE 0 END), 0)`,
      tabuTotalTravelTime: sql<number>`COALESCE(SUM(CASE WHEN o.algorithm = 'tabu_search' THEN o.total_travel_time_in_seconds ELSE 0 END), 0)`,
      tabuComputationTime: sql<number>`COALESCE(SUM(CASE WHEN o.algorithm = 'tabu_search' THEN o.computation_time_in_ms ELSE 0 END), 0)`,

      totalNodesExplored: sql<number>`COALESCE(SUM(CASE WHEN o.algorithm = 'tabu_search' THEN o.total_nodes_explored ELSE 0 END), 0)`,
    })
    .from(sql`optimization_runs o`)
    .where(sql`o.id IN (${optimizationScope})`);

  return {
    greedySummary: {
      totalDistanceInMeters: row?.greedyTotalDistance ?? 0,
      totalTimeTravelledInSeconds: row?.greedyTotalTravelTime ?? 0,
      computationTimeInMs: row?.greedyComputationTime ?? 0,
    },
    tabuSearchSummary: {
      totalDistanceInMeters: row?.tabuTotalDistance ?? 0,
      totalTimeTravelledInSeconds: row?.tabuTotalTravelTime ?? 0,
      computationTimeInMs: row?.tabuComputationTime ?? 0,
    },
  };
};

const RUN_TYPE_MAPPING: Record<TOptimizationSummaryParams["summaryType"], string[]> = {
  initial: ["initial", "baseline_tracking", "duration_update"],
  final: ["initial", "reoptimization"],
};

export const getTimeSeriesSummaryRepository = async (
  simulationId: string,
  queryParams: TOptimizationSummaryParams,
) => {
  const { summaryType, courierId } = queryParams;

  if (!courierId) {
    return [];
  }

  const runTypes = RUN_TYPE_MAPPING[summaryType];

  const [result, [latestRouteLeg]] = await Promise.all([
    db
      .select({
        triggeredAt: optimizationRunTable.triggeredAt,
        greedyTime: sql<number>`
        MAX(
          CASE 
            WHEN ${optimizationRunTable.algorithm} = 'greedy'
            THEN ${optimizationRunTable.totalTravelTimeInSeconds}
          END
        )
      `,

        tabuTime: sql<number>`
        MAX(
          CASE 
            WHEN ${optimizationRunTable.algorithm} = 'tabu_search'
            THEN ${optimizationRunTable.totalTravelTimeInSeconds}
          END
        )
      `,
      })
      .from(optimizationRunTable)
      .where(
        and(
          eq(optimizationRunTable.courierId, courierId),
          inArray(optimizationRunTable.runType, runTypes),
          eq(optimizationRunTable.simulationId, simulationId),
        ),
      )
      .groupBy(optimizationRunTable.triggeredAt, optimizationRunTable.runType)
      .orderBy(optimizationRunTable.triggeredAt),
    db
      .select({
        arrivalTime: routeLegTable.arrivalTime,
      })
      .from(routeLegTable)
      .innerJoin(courierRouteTable, eq(routeLegTable.courierRouteId, courierRouteTable.id))
      .where(eq(courierRouteTable.courierId, courierId))
      .orderBy(desc(routeLegTable.arrivalTime))
      .limit(1),
  ]);

  const lastData = result[result.length - 1];

  if (latestRouteLeg && latestRouteLeg.arrivalTime > lastData?.triggeredAt) {
    result.push({
      triggeredAt: latestRouteLeg.arrivalTime,
      greedyTime: lastData?.greedyTime ?? 0,
      tabuTime: lastData?.tabuTime ?? 0,
    });
  }

  return result;
};

const ALGORITHM_KEY_MAP = {
  greedy: { baseline: "greedyBaselineTime", final: "greedyFinalTime" },
  tabu_search: { baseline: "tabuBaselineTime", final: "tabuFinalTime" },
} as const;

type AlgorithmKey = keyof typeof ALGORITHM_KEY_MAP;

export const getComparisonChartRepository = async (simulationId: string) => {
  const runs = await db
    .select({
      courierId: optimizationRunTable.courierId,
      courierName: courierTable.name,
      algorithm: optimizationRunTable.algorithm,
      runType: optimizationRunTable.runType,
      time: optimizationRunTable.totalTravelTimeInSeconds,
    })
    .from(optimizationRunTable)
    .innerJoin(courierTable, eq(optimizationRunTable.courierId, courierTable.id))
    .where(eq(optimizationRunTable.simulationId, simulationId))
    .orderBy(asc(optimizationRunTable.createdAt));

  const resultsMap = new Map<number, TComparisonChartDataItem>();

  for (const { courierId, courierName, algorithm, runType, time } of runs) {
    const keys = ALGORITHM_KEY_MAP[algorithm as AlgorithmKey];
    if (!keys) continue;

    if (!resultsMap.has(courierId)) {
      resultsMap.set(courierId, {
        courierId,
        courierName,
        greedyBaselineTime: 0,
        greedyFinalTime: 0,
        tabuBaselineTime: 0,
        tabuFinalTime: 0,
      });
    }

    const data = resultsMap.get(courierId)!;

    if (runType === "initial") {
      if (data[keys.baseline] === 0) data[keys.baseline] = time;
      data[keys.final] = time;
    } else if (runType === "baseline_tracking") {
      data[keys.baseline] = time;
    } else if (runType === "reoptimization" || runType === "duration_update") {
      data[keys.final] = time;
    }
  }

  return Array.from(resultsMap.values()).sort((a, b) => a.courierName.localeCompare(b.courierName));
};
