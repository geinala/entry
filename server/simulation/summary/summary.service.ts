import { TGlobalAlgorithmSummary } from "@/types/database";
import {
  getComparisonChartRepository,
  getGlobalSummaryAlgorithmRepository,
  getTimeSeriesSummaryRepository,
} from "./summary.repository";
import { TOptimizationSummaryParams } from "@/schemas/simulations/optimization-summary.schema";

export const getGlobalSummaryAlgorithmService = async (
  simulationId: string,
  queryParams: TOptimizationSummaryParams,
): Promise<TGlobalAlgorithmSummary> => {
  const result = await getGlobalSummaryAlgorithmRepository(simulationId, queryParams);

  const timeTravelImprovement =
    result.greedySummary.totalTimeTravelledInSeconds > 0
      ? ((result.greedySummary.totalTimeTravelledInSeconds -
          result.tabuSearchSummary.totalTimeTravelledInSeconds) /
          result.greedySummary.totalTimeTravelledInSeconds) *
        100
      : 0;

  const distanceImprovement =
    result.greedySummary.totalDistanceInMeters > 0
      ? ((result.greedySummary.totalDistanceInMeters -
          result.tabuSearchSummary.totalDistanceInMeters) /
          result.greedySummary.totalDistanceInMeters) *
        100
      : 0;

  const computationTimeImprovement =
    result.greedySummary.computationTimeInMs > 0
      ? ((result.greedySummary.computationTimeInMs - result.tabuSearchSummary.computationTimeInMs) /
          result.greedySummary.computationTimeInMs) *
        100
      : 0;

  return {
    ...result,
    improvement: {
      totalDistanceImprovementPercentage: distanceImprovement,
      totalTimeTravelledImprovementPercentage: timeTravelImprovement,
      computationTimeImprovementPercentage: computationTimeImprovement,
    },
  };
};

export const getTimeSeriesSummaryService = async (
  simulationId: string,
  queryParams: TOptimizationSummaryParams,
) => {
  return await getTimeSeriesSummaryRepository(simulationId, queryParams);
};

export const getComparisonChartService = async (simulationId: string) => {
  return await getComparisonChartRepository(simulationId);
};
