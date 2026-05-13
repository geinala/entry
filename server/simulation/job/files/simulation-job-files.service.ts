import { TSimulationUploadedRow } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { paginationResponseMapper } from "@/lib/pagination";
import {
  deleteAllSimulationUploadedErrorsAndContinueRepository,
  deleteSimulationUploadedRowRepository,
  getSimulationUploadedErrorsRowsWithPaginationRepository,
  updateSimulationUploadedRowRepository,
} from "./simulation-job-files.repository";
import { TUpdateSimulationUploadedRowSchema } from "@/schemas/simulations/jobs/update-simulation-uploaded-row.schema";
import { TSimulationJobFilesIndexQueryParams } from "@/schemas/simulations/jobs/simulation-job-index-query-params";
import { server } from "@/lib/axios";

export const getSimulationUploadedErrorsRowsService = async (
  jobId: string,
  queryParams: TSimulationJobFilesIndexQueryParams,
): Promise<TPaginationResponse<TSimulationUploadedRow>> => {
  const [entries, total] = await getSimulationUploadedErrorsRowsWithPaginationRepository(
    jobId,
    queryParams,
  );

  return paginationResponseMapper<TSimulationUploadedRow>(entries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

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
