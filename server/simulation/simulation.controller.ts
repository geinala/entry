import "server-only";

import { responseFormatter } from "@/lib/response-formatter";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import {
  CreateSimulationConstraintsSchema,
  CreateSimulationSchema,
  IndexSimulationQueryParams,
  SimulationIdParamSchema,
  TCreateSimulationSchema,
} from "@/schemas/simulation.schema";
import { NextRequest } from "next/server";
import {
  createSimulationService,
  getSimulationByIdService,
  getSimulationsWithPaginationService,
  getSimulationUploadedFileBySimulationIdService,
  startSimulationService,
  uploadSimulationFileService,
} from "./simulation.service";
import { checkUserPermissionsService } from "../permission/permission.service";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { parseSortParams } from "@/lib/query-param";
import { handleException } from "@/common/exception/helper";
import { CSVUploadedSchema, TCSVUploaded } from "@/schemas/file.schema";
import { NotFoundException } from "@/common/exception/not-found.exception";

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

export const uploadSimulationFileController = async (
  clerkUserId: string,
  simulationId: string,
  request: NextRequest,
) => {
  try {
    validateSchema(
      SimulationIdParamSchema,
      { simulationId },
      () => new NotFoundException("Simulation not found"),
    );

    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.VIEW_SIMULATION]);

    const formData = await request.formData();

    const file = formData.get("file");

    const { data } = validateSchema<TCSVUploaded>(CSVUploadedSchema, { file });
    const { file: validatedFile } = data;

    const result = await uploadSimulationFileService(clerkUserId, simulationId, validatedFile);

    return responseFormatter.successWithData({
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getSimulationUploadedFileController = async (
  clerkUserId: string,
  simulationId: string,
) => {
  try {
    validateSchema(
      SimulationIdParamSchema,
      { simulationId },
      () => new NotFoundException("Simulation not found"),
    );

    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.VIEW_SIMULATION]);

    const file = await getSimulationUploadedFileBySimulationIdService(simulationId);

    return responseFormatter.successWithData({
      data: file,
      message: "Uploaded file retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const startSimulationController = async (simulationId: string, request: NextRequest) => {
  try {
    const body = await request.json();

    validateSchema(CreateSimulationConstraintsSchema, body);

    await startSimulationService(simulationId, body);

    return responseFormatter.success({
      message: "Simulation started successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
