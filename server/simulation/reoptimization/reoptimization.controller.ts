import "server-only";

import { NextRequest } from "next/server";
import { handleException } from "@/common/exception/helper";
import { parseQueryParams } from "@/lib/validation";
import { BadRequestException } from "@/common/exception/bad-request.exception";
import { IndexQueryParams } from "@/types/query-params";
import { getReoptimizationEventsWithPaginationService } from "./reoptimization.service";
import { TReoptimizationEvent } from "@/types/database";
import { responseFormatter } from "@/lib/response-formatter";

export const getReoptimizationEventsWithPaginationController = async (
  request: NextRequest,
  simulationId: string,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
    };

    const result = parseQueryParams(IndexQueryParams, rawQueryParams);

    if (!result.success) {
      throw new BadRequestException("Invalid query parameters");
    }

    const { data, meta } = await getReoptimizationEventsWithPaginationService(
      simulationId,
      result.data,
    );

    return responseFormatter.successWithPagination<TReoptimizationEvent>({
      data,
      meta,
      message: "Reoptimization events retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
