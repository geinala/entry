import { TGlobalAlgorithmSummary } from "@/types/database";
import { getGlobalSummaryAlgorithmRepository } from "./summary.repository";

export const getGlobalSummaryAlgorithmService = async (
  simulationId: string,
): Promise<TGlobalAlgorithmSummary> => {
  const result = await getGlobalSummaryAlgorithmRepository(simulationId);

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
