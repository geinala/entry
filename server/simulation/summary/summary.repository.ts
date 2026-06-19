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
  queryParams: Omit<TOptimizationSummaryParams, "summaryType">,
): Promise<TGlobalAlgorithmSummary> => {
  const courierId = queryParams.courierId ? Number(queryParams.courierId) : null;

  const [row] = await db.select({
    greedyInitialDistance: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='greedy'
        THEN initial_distance
        ELSE 0 END
      ),0)
    `,

    greedyFinalDistance: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='greedy'
        THEN final_distance
        ELSE 0 END
      ),0)
    `,

    greedyInitialComputationTime: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='greedy'
        THEN initial_computation_time
        ELSE 0 END
      ),0)
    `,

    greedyFinalComputationTime: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='greedy'
        THEN final_computation_time
        ELSE 0 END
      ),0)
    `,

    greedyInitialTime: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='greedy'
        THEN initial_time
        ELSE 0 END
      ),0)
    `,

    greedyFinalTime: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='greedy'
        THEN final_time
        ELSE 0 END
      ),0)
    `,

    tabuInitialDistance: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='tabu_search'
        THEN initial_distance
        ELSE 0 END
      ),0)
    `,

    tabuFinalDistance: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='tabu_search'
        THEN final_distance
        ELSE 0 END
      ),0)
    `,

    tabuInitialTime: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='tabu_search'
        THEN initial_time
        ELSE 0 END
      ),0)
    `,

    tabuFinalTime: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='tabu_search'
        THEN final_time
        ELSE 0 END
      ),0)`,

    tabuInitialComputationTime: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='tabu_search'
        THEN initial_computation_time
        ELSE 0 END
      ),0)
    `,

    tabuFinalComputationTime: sql<number>`
      COALESCE(SUM(
        CASE WHEN algorithm='tabu_search'
        THEN final_computation_time
        ELSE 0 END
      ),0)
    `,
  }).from(sql`
    (
      WITH initial_runs AS (

        SELECT DISTINCT ON (
          o.algorithm,
          o.courier_id
        )
          o.algorithm,
          o.courier_id,
          o.total_distance_in_meters AS initial_distance,
          o.total_travel_time_in_seconds AS initial_time,
          o.computation_time_in_ms AS initial_computation_time

        FROM optimization_runs o

        WHERE
          o.simulation_id=${simulationId}
          AND o.run_type IN (
            'initial',
            'baseline_tracking'
          )

          ${courierId !== null ? sql`AND o.courier_id=${courierId}` : sql``}

        ORDER BY
          o.algorithm,
          o.courier_id,
          o.triggered_at DESC

      ),


      final_runs AS (

        SELECT DISTINCT ON (
          o.algorithm,
          o.courier_id
        )

          o.algorithm,
          o.courier_id,
          o.total_distance_in_meters AS final_distance,
          o.total_travel_time_in_seconds AS final_time,
          o.computation_time_in_ms AS final_computation_time


        FROM optimization_runs o

        WHERE
          o.simulation_id=${simulationId}

          AND o.run_type='reoptimization'


          ${courierId !== null ? sql`AND o.courier_id=${courierId}` : sql``}


        ORDER BY
          o.algorithm,
          o.courier_id,
          o.triggered_at DESC
      )


      SELECT

        i.algorithm,

        i.initial_distance,

        COALESCE(
          f.final_distance,
          i.initial_distance
        ) AS final_distance,

        i.initial_time,

        COALESCE(
          f.final_time,
          i.initial_time
        ) AS final_time,

        i.initial_computation_time,

        COALESCE(
          f.final_computation_time,
          0
        ) AS final_computation_time


      FROM initial_runs i

      LEFT JOIN final_runs f

      ON
        i.algorithm=f.algorithm
        AND
        i.courier_id=f.courier_id

    ) summary
  `);

  return {
    greedyInitial: {
      computationTimeInMs: row?.greedyInitialComputationTime ?? 0,
      totalDistanceInMeters: row?.greedyInitialDistance ?? 0,
      totalTimeTravelledInSeconds: row?.greedyInitialTime ?? 0,
    },

    greedyFinal: {
      totalDistanceInMeters: row?.greedyFinalDistance ?? 0,
      totalTimeTravelledInSeconds: row?.greedyFinalTime ?? 0,
      computationTimeInMs: row?.greedyFinalComputationTime ?? 0,
    },

    tabuSearchInitial: {
      computationTimeInMs: row?.tabuInitialComputationTime ?? 0,
      totalDistanceInMeters: row?.tabuInitialDistance ?? 0,
      totalTimeTravelledInSeconds: row?.tabuInitialTime ?? 0,
    },

    tabuSearchFinal: {
      totalDistanceInMeters: row?.tabuFinalDistance ?? 0,
      totalTimeTravelledInSeconds: row?.tabuFinalTime ?? 0,
      computationTimeInMs: row?.tabuFinalComputationTime ?? 0,
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
  greedy: {
    baseline: "greedyBaselineTime",
    final: "greedyFinalTime",
  },

  greedy_with_2opt: {
    baseline: "greedyBaselineTime",
    final: "greedyFinalTime",
  },

  greedy_without_2opt: {
    baseline: "greedyBaselineTime",
    final: "greedyFinalTime",
  },

  tabu_search: {
    baseline: "tabuBaselineTime",
    final: "tabuFinalTime",
  },

  tabu_search_with_2opt: {
    baseline: "tabuBaselineTime",
    final: "tabuFinalTime",
  },

  tabu_search_without_2opt: {
    baseline: "tabuBaselineTime",
    final: "tabuFinalTime",
  },
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

    if (!keys) {
      continue;
    }

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
      if (data[keys.baseline] === 0) {
        data[keys.baseline] = time;
      }

      data[keys.final] = time;
    } else if (runType === "baseline_tracking") {
      data[keys.baseline] = time;
    } else if (runType === "reoptimization" || runType === "duration_update") {
      data[keys.final] = time;
    }
  }

  return Array.from(resultsMap.values()).sort((a, b) => a.courierName.localeCompare(b.courierName));
};
