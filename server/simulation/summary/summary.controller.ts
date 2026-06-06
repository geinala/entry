import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import "server-only";
import {
  getComparisonChartService,
  getGlobalSummaryAlgorithmService,
  getTimeSeriesSummaryService,
} from "./summary.service";
import { NextRequest } from "next/server";
import { validateSchema } from "@/lib/validation";
import {
  OptimizationSummarySchema,
  TOptimizationSummaryParams,
} from "@/schemas/simulations/optimization-summary.schema";

export const getGlobalSummaryAlgorithmController = async (
  simulationId: string,
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      courierId: searchParams.get("courierId"),
      summaryType: searchParams.get("summaryType"),
    };

    const { data } = validateSchema<TOptimizationSummaryParams>(
      OptimizationSummarySchema,
      rawQueryParams,
    );

    const result = await getGlobalSummaryAlgorithmService(simulationId, data);

    return responseFormatter.successWithData({
      message: "Global summary retrieved successfully",
      data: result,
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getTimeSeriesSummaryController = async (
  simulationId: string,
  request: NextRequest,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      courierId: searchParams.get("courierId"),
      summaryType: searchParams.get("summaryType"),
    };

    const data = validateSchema<TOptimizationSummaryParams>(
      OptimizationSummarySchema,
      rawQueryParams,
    );

    const result = await getTimeSeriesSummaryService(simulationId, data.data);

    return responseFormatter.successWithData({
      message: "Time series summary retrieved successfully",
      data: result,
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getComparisonChartController = async (simulationId: string) => {
  try {
    const result = await getComparisonChartService(simulationId);

    return responseFormatter.successWithData({
      message: "Comparison chart data retrieved successfully",
      data: result,
    });
  } catch (error) {
    return handleException(error);
  }
};
