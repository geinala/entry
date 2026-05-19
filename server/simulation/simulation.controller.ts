import "server-only";

import { responseFormatter } from "@/lib/response-formatter";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { IndexSimulationQueryParams, SimulationIdParamSchema } from "@/schemas/simulation.schema";
import { NextRequest } from "next/server";
import { checkUserPermissionsService } from "../permission/permission.service";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { parseSortParams } from "@/lib/query-param";
import { handleException } from "@/common/exception/helper";
import { NotFoundException } from "@/common/exception/not-found.exception";
import {
  getSimulationByIdService,
  getSimulationsWithPaginationService,
} from "./simulation.service";

export const getSimulationsController = async (clerkUserId: string, req: NextRequest) => {
  try {
    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.VIEW_SIMULATION]);

    const { searchParams } = new URL(req.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      status: searchParams.get("status") || undefined,
    };

    const result = parseQueryParams(IndexSimulationQueryParams, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;

    const { data, meta } = await getSimulationsWithPaginationService(clerkUserId, queryParams);

    return responseFormatter.successWithPagination({
      data,
      meta,
      message: "Simulations retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getSimulationByIdController = async (clerkUserId: string, simulationId: string) => {
  try {
    validateSchema(
      SimulationIdParamSchema,
      { simulationId },
      () => new NotFoundException("Simulation not found"),
    );

    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.VIEW_SIMULATION]);

    const simulation = await getSimulationByIdService(simulationId);

    return responseFormatter.successWithData({
      data: simulation,
      message: "Simulation retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
