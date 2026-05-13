import { TSimulationJobFilesIndexQueryParams } from "@/schemas/simulations/jobs/simulation-job-index-query-params";
import { TSimulationJobFileValidationStatusEnum, TSimulationUploadedRow } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

export const multiStepSimulationCreationQueries = {
  getSimulationAddressErrors: (
    api: AxiosInstance,
    queryParams: TSimulationJobFilesIndexQueryParams,
    id?: string,
  ) => {
    return queryOptions({
      queryKey: ["simulationAddressErrors", id, queryParams],
      queryFn: async (): Promise<TPaginationResponse<TSimulationUploadedRow>> => {
        return await api.get(`/simulations/jobs/${id}/files/rows`, {
          params: queryParams,
        });
      },
      enabled: !!id,
    });
  },
  getSimulationUploadedRows: (
    api: AxiosInstance,
    queryParams: TSimulationJobFilesIndexQueryParams,
    fileValidationStatus?: TSimulationJobFileValidationStatusEnum,
    id?: string,
  ) => {
    return queryOptions({
      queryKey: ["simulationUploadedRows", id, queryParams],
      queryFn: async (): Promise<TPaginationResponse<TSimulationUploadedRow>> => {
        return await api.get(`/simulations/jobs/${id}/files/rows`, {
          params: queryParams,
        });
      },
      enabled: fileValidationStatus === "needed_review",
      refetchInterval: (query) => {
        const state = query.state.data;
        // Refetch every 5 seconds if the file validation is still in progress
        if (
          fileValidationStatus === "uploaded" ||
          fileValidationStatus === "validating" ||
          (fileValidationStatus === "needed_review" && state?.data.length === 0)
        ) {
          return 5000; // 5 seconds
        }

        return false; // Stop refetching if validation is completed or failed
      },
    });
  },
};
