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
  return await getGlobalSummaryAlgorithmRepository(simulationId, queryParams);
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
