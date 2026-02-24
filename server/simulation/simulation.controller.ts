import "server-only";

import { responseFormatter } from "@/lib/response-formatter";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import {
  CreateSimulationSchema,
  IndexSimulationQueryParams,
  TCreateSimulationSchema,
} from "@/schemas/simulation.schema";
import { NextRequest } from "next/server";
import {
  createSimulationService,
  getSimulationByIdService,
  getSimulationsWithPaginationService,
} from "./simulation.service";
import { checkUserPermissionsService } from "../permission/permission.service";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { parseSortParams } from "@/lib/query-param";
import { handleException } from "@/common/exception/helper";

export const createSimulationController = async (clerkUserId: string, request: NextRequest) => {
  try {
    const body = await request.json();

    const { data } = validateSchema<TCreateSimulationSchema>(CreateSimulationSchema, body);

    const createdSimulation = await createSimulationService(clerkUserId, data);

    return responseFormatter.created({
      data: createdSimulation,
      message: "Simulation created successfully",
    });
  } catch (error) {
    return handleException(error);
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
  } catch (error) {
    return handleException(error);
  }
};

export const getSimulationByIdController = async (clerkUserId: string, simulationId: string) => {
  try {
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
