import { TSimulationUploadedRow } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { paginationResponseMapper } from "@/lib/pagination";
import {
  deleteAllSimulationUploadedErrorsAndContinueRepository,
  deleteSimulationUploadedRowRepository,
  deleteSimulationUploadedRowsWithErrorsBulkRepository,
  getAllNeedReviewSimulationUploadedRowsWithPaginationRepository,
  ignoreSimulationUploadedRowsWithErrorsBulkRepository,
  updateSimulationUploadedRowRepository,
} from "./files.repository";
import { TUpdateSimulationUploadedRowSchema } from "@/schemas/simulations/jobs/update-simulation-uploaded-row.schema";
import { server } from "@/lib/axios";
import { TSimulationJobUploadedRowsIndexQueryParams } from "@/schemas/simulations/jobs/simulation-job-index-query-params";

export const updateSimulationUploadedRowService = async (
  jobId: string,
  rowId: number,
  payload: TUpdateSimulationUploadedRowSchema,
) => {
  return await updateSimulationUploadedRowRepository(jobId, rowId, payload);
};

export const deleteSimulationUploadedRowService = async (jobId: string, rowId: number) => {
  return await deleteSimulationUploadedRowRepository(jobId, rowId);
};

export const deleteAllSimulationUploadedErrorsAndContinueService = async (jobId: string) => {
  try {
    await Promise.all([
      deleteAllSimulationUploadedErrorsAndContinueRepository(jobId),
      server.post(`/simulations/jobs/${jobId}/process-addresses`),
    ]);
  } catch (error) {
    throw error;
  }
};

export const getAllNeedReviewSimulationUploadedRowsWithPaginationService = async (
  jobId: string,
  queryParams: TSimulationJobUploadedRowsIndexQueryParams,
): Promise<TPaginationResponse<TSimulationUploadedRow>> => {
  const [entries, total] = await getAllNeedReviewSimulationUploadedRowsWithPaginationRepository(
    jobId,
    queryParams,
  );

  return paginationResponseMapper<TSimulationUploadedRow>(entries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const deleteSimulationUploadedRowsBulkService = async (jobId: string, rowIds: number[]) => {
  await deleteSimulationUploadedRowsWithErrorsBulkRepository(jobId, rowIds);
};

export const ignoreSimulationUploadedRowsBulkService = async (jobId: string, rowIds: number[]) => {
  await ignoreSimulationUploadedRowsWithErrorsBulkRepository(jobId, rowIds);
};
