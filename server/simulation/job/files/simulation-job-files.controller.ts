import "server-only";

import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { responseFormatter } from "@/lib/response-formatter";
import { NextRequest } from "next/server";
import { TSimulationUploadedRow } from "@/types/database";
import {
  deleteAllSimulationUploadedErrorsAndContinueService,
  deleteSimulationUploadedRowService,
  getAllNeedReviewSimulationUploadedRowsWithPaginationService,
  updateSimulationUploadedRowService,
} from "./simulation-job-files.service";
import {
  TUpdateSimulationUploadedRowSchema,
  UpdateSimulationUploadedRowSchema,
} from "@/schemas/simulations/jobs/update-simulation-uploaded-row.schema";
import { SimulationJobUploadedRowsIndexQueryParams } from "@/schemas/simulations/jobs/simulation-job-index-query-params";

export const updateSimulationUploadedRowController = async (
  jobId: string,
  rowId: string,
  req: NextRequest,
) => {
  try {
    const parsedRowId = Number(rowId);

    if (!Number.isInteger(parsedRowId) || parsedRowId <= 0) {
      return responseFormatter.badRequest({
        message: "Invalid row id",
      });
    }

    const body = await req.json();
    const { data } = validateSchema<TUpdateSimulationUploadedRowSchema>(
      UpdateSimulationUploadedRowSchema,
      body,
    );

    const updatedRow = await updateSimulationUploadedRowService(jobId, parsedRowId, data);

    if (!updatedRow) {
      return responseFormatter.notFound("Uploaded row not found");
    }

    return responseFormatter.successWithData({
      data: updatedRow,
      message: "Uploaded row updated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteSimulationUploadedRowController = async (jobId: string, rowId: string) => {
  try {
    const parsedRowId = Number(rowId);

    if (!Number.isInteger(parsedRowId) || parsedRowId <= 0) {
      return responseFormatter.badRequest({
        message: "Invalid row id",
      });
    }

    const deletedRow = await deleteSimulationUploadedRowService(jobId, parsedRowId);

    if (!deletedRow) {
      return responseFormatter.notFound("Uploaded row not found");
    }

    return responseFormatter.success({
      message: "Uploaded row deleted successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteAllSimulationUploadedErrorsController = async (jobId: string) => {
  try {
    await deleteAllSimulationUploadedErrorsAndContinueService(jobId);

    return responseFormatter.deleted({
      message: "All uploaded errors deleted successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getAllNeedReviewSimulationUploadedRowsWithPaginationController = async (
  req: NextRequest,
  simulationJobId: string,
) => {
  try {
    const { searchParams } = new URL(req.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      currentStep: Number(searchParams.get("currentStep")),
    };

    const result = parseQueryParams(SimulationJobUploadedRowsIndexQueryParams, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const { data, meta } = await getAllNeedReviewSimulationUploadedRowsWithPaginationService(
      simulationJobId,
      result.data,
    );

    return responseFormatter.successWithPagination<TSimulationUploadedRow>({
      data,
      meta,
      message: "Simulation job files that need review retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
