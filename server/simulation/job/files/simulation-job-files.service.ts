import { TSimulationUploadedRow } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TIndexQueryParams } from "@/types/query-params";
import { paginationResponseMapper } from "@/lib/pagination";
import {
  deleteSimulationUploadedRowRepository,
  getSimulationUploadedRows,
  getSimulationUploadedRowsCountRepository,
  updateSimulationUploadedRowRepository,
} from "./simulation-job-files.repository";
import { TUpdateSimulationUploadedRowSchema } from "@/schemas/simulations/jobs/update-simulation-uploaded-row.schema";

export const getSimulationUploadedRowsService = async (
  jobId: string,
  queryParams: TIndexQueryParams,
): Promise<TPaginationResponse<TSimulationUploadedRow>> => {
  const [entries, total] = await Promise.all([
    getSimulationUploadedRows(jobId, queryParams),
    getSimulationUploadedRowsCountRepository(jobId, queryParams),
  ]);

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
