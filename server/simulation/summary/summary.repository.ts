import { db } from "@/lib/db";
import { TOptimizationSummaryParams } from "@/schemas/simulations/optimization-summary.schema";
import { TGlobalAlgorithmSummary } from "@/types/database";
import { sql } from "drizzle-orm";

export const getGlobalSummaryAlgorithmRepository = async (
  simulationId: string,
  queryParams: TOptimizationSummaryParams,
): Promise<Omit<TGlobalAlgorithmSummary, "improvement">> => {
  const summaryType = queryParams.summaryType ?? "initial";
  const courierId = queryParams.courierId ? Number(queryParams.courierId) : null;

  const optimizationScope =
    summaryType === "initial"
      ? sql`
        SELECT o.id
        FROM optimization_runs o
        WHERE
          o.simulation_id = ${simulationId}
          AND o.run_type = 'initial'
          ${courierId !== null ? sql`AND o.courier_id = ${courierId}` : sql``}
      `
      : sql`
        SELECT DISTINCT ON (o.courier_id, o.algorithm) o.id
        FROM optimization_runs o
        WHERE
          o.simulation_id = ${simulationId}
          AND (o.run_type = 'initial' OR o.run_type = 'reoptimization')
          ${courierId !== null ? sql`AND o.courier_id = ${courierId}` : sql``}
        ORDER BY o.courier_id, o.algorithm, o.triggered_at DESC
      `;

  const [row] = await db
    .select({
      greedyTotalDistance: sql<number>`
        COALESCE(SUM(
          CASE WHEN o.algorithm = 'greedy'
          THEN o.total_distance_in_meters ELSE 0 END
        ), 0)
      `,
      greedyTotalTravelTime: sql<number>`
        COALESCE(SUM(
          CASE WHEN o.algorithm = 'greedy'
          THEN o.total_travel_time_in_seconds ELSE 0 END
        ), 0)
      `,
      greedyComputationTime: sql<number>`
        COALESCE(SUM(
          CASE WHEN o.algorithm = 'greedy'
          THEN o.computation_time_in_ms ELSE 0 END
        ), 0)
      `,
      tabuTotalDistance: sql<number>`
        COALESCE(SUM(
          CASE WHEN o.algorithm = 'tabu_search'
          THEN o.total_distance_in_meters ELSE 0 END
        ), 0)
      `,
      tabuTotalTravelTime: sql<number>`
        COALESCE(SUM(
          CASE WHEN o.algorithm = 'tabu_search'
          THEN o.total_travel_time_in_seconds ELSE 0 END
        ), 0)
      `,
      tabuComputationTime: sql<number>`
        COALESCE(SUM(
          CASE WHEN o.algorithm = 'tabu_search'
          THEN o.computation_time_in_ms ELSE 0 END
        ), 0)
      `,
      totalNodesExplored: sql<number>`
        COALESCE(SUM(
          CASE WHEN o.algorithm = 'tabu_search'
          THEN o.total_nodes_explored ELSE 0 END
        ), 0)
      `,
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
    totalNodesExplored: row?.totalNodesExplored ?? 0,
  };
};
