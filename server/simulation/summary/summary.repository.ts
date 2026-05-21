import { optimizationRunTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { TGlobalAlgorithmSummary } from "@/types/database";
import { sql } from "drizzle-orm";

export const getGlobalSummaryAlgorithmRepository = async (
  simulationId: string,
): Promise<Omit<TGlobalAlgorithmSummary, "improvement">> => {
  const [row] = await db
    .select({
      greedyTotalDistance: sql<number>`
        COALESCE(SUM(
          CASE
            WHEN ${optimizationRunTable.algorithm} = 'greedy'
            THEN ${optimizationRunTable.totalDistanceInMeters}
            ELSE 0
          END
        ), 0)
      `,

      greedyTotalTravelTime: sql<number>`
        COALESCE(SUM(
          CASE
            WHEN ${optimizationRunTable.algorithm} = 'greedy'
            THEN ${optimizationRunTable.totalTravelTimeInSeconds}
            ELSE 0
          END
        ), 0)
      `,

      greedyComputationTime: sql<number>`
        COALESCE(SUM(
          CASE
            WHEN ${optimizationRunTable.algorithm} = 'greedy'
            THEN ${optimizationRunTable.computationTimeInMs}
            ELSE 0
          END
        ), 0)
      `,

      tabuTotalDistance: sql<number>`
        COALESCE(SUM(
          CASE
            WHEN ${optimizationRunTable.algorithm} = 'tabu_search'
            THEN ${optimizationRunTable.totalDistanceInMeters}
            ELSE 0
          END
        ), 0)
      `,

      tabuTotalTravelTime: sql<number>`
        COALESCE(SUM(
          CASE
            WHEN ${optimizationRunTable.algorithm} = 'tabu_search'
            THEN ${optimizationRunTable.totalTravelTimeInSeconds}
            ELSE 0
          END
        ), 0)
      `,

      tabuComputationTime: sql<number>`
        COALESCE(SUM(
          CASE
            WHEN ${optimizationRunTable.algorithm} = 'tabu_search'
            THEN ${optimizationRunTable.computationTimeInMs}
            ELSE 0
          END
        ), 0)
      `,

      totalNodesExplored: sql<number>`
        COALESCE(SUM(
          CASE
            WHEN ${optimizationRunTable.algorithm} = 'tabu_search'
            THEN ${optimizationRunTable.totalNodesExplored}
            ELSE 0
          END
        ), 0)`,
    })
    .from(optimizationRunTable)
    .where(sql`${optimizationRunTable.simulationId} = ${simulationId}`);

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
