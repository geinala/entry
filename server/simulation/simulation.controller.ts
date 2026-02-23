import "server-only";

import { BaseException } from "@/common/exception/base.exception";
import { responseFormatter } from "@/lib/response-formatter";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { CreateSimulationSchema, IndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { NextRequest } from "next/server";
import { createSimulationService, getSimulationsWithPaginationService } from "./simulation.service";
import { checkUserPermissionsService } from "../permission/permission.service";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { parseSortParams } from "@/lib/query-param";

export const createSimulationController = async (clerkUserId: string, request: NextRequest) => {
  try {
    const body = await request.json();

    const result = validateSchema(CreateSimulationSchema, body);

    if (!result.success && result.error) {
      return responseFormatter.validationError({
        message: "Invalid request body",
        error: result.error,
      });
    }

    const createdSimulation = await createSimulationService(clerkUserId, result.data);

    return responseFormatter.created({
      data: createdSimulation,
      message: "Simulation created successfully",
    });
  } catch (error) {
    if (error instanceof BaseException) {
      return responseFormatter.error({ message: error.message, status: error.statusCode });
    }

    return responseFormatter.error({ message: "Failed to create simulation" });
  }
};

export const getSimulationsController = async (clerkUserId: string, req: NextRequest) => {
  try {
    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.VIEW_SIMULATION]);

    const { searchParams } = new URL(req.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      status: searchParams.get("status") || "pending",
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
  } catch {
    return responseFormatter.error({ message: "Failed to fetch simulations" });
  }
};
