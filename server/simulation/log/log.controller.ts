import "server-only";

import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import { NextRequest } from "next/server";
import { parseQueryParams } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import { getSimulationLogByIdService, getSimulationLogsWithPaginationService } from "./log.service";
import { TSimulationLog } from "@/types/database";
import { NotFoundException } from "@/common/exception/not-found.exception";

export const getSimulationLogsWithPaginationController = async (
  req: NextRequest,
  simulationId: string,
) => {
  try {
    const { searchParams } = new URL(req.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
    };

    const result = parseQueryParams(IndexQueryParams, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const { data, meta } = await getSimulationLogsWithPaginationService(simulationId, result.data);

    return responseFormatter.successWithPagination<TSimulationLog>({
      data,
      meta,
      message: "Simulation logs retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getSimulationLogByIdController = async (simulationId: string, logId: number) => {
  try {
    const log = await getSimulationLogByIdService(simulationId, logId);

    if (!log) {
      throw new NotFoundException("Simulation log not found");
    }

    return responseFormatter.successWithData({
      data: log,
      message: "Simulation log retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
