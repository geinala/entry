import { TSimulationJobUploadedRowsIndexQueryParams } from "@/schemas/simulations/jobs/simulation-job-index-query-params";
import { TSimulationJobSummary, TSimulationUploadedRow } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TApiSuccessResponseWithData, TApiSuccessResponseWithPagination } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

interface IGetAllNeedReviewSimulationUploadedRowsParams {
  api: AxiosInstance;
  queryParams: TSimulationJobUploadedRowsIndexQueryParams;
  id?: string;
  shouldRefetch?: boolean;
}

export const multiStepSimulationCreationQueries = {
  getAllNeedReviewSimulationUploadedRows: ({
    api,
    queryParams,
    shouldRefetch = true,
    id,
  }: IGetAllNeedReviewSimulationUploadedRowsParams) => {
    return queryOptions({
      queryKey: ["simulationUploadedRows", id, queryParams],
      queryFn: async (): Promise<TPaginationResponse<TSimulationUploadedRow>> => {
        const response: AxiosResponse<TApiSuccessResponseWithPagination<TSimulationUploadedRow>> =
          await api.get(`/simulations/jobs/${id}/files/rows/reviews`, {
            params: queryParams,
          });

        return response.data.data;
      },
      enabled: !!id,
      refetchInterval: (query) => {
        const data = query.state.data;

        // Refetch every 3 seconds if the file validation is still in progress
        if (shouldRefetch && data && data.data.length === 0) {
          return 3000; // 3 seconds
        }

        return false; // Stop refetching if validation is completed or failed
      },
    });
  },
  getSimulationJobSummary: (api: AxiosInstance, id?: string) => {
    return queryOptions({
      queryKey: ["simulationJobSummary", id],
      queryFn: async (): Promise<TSimulationJobSummary> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TSimulationJobSummary>> =
          await api.get(`/simulations/jobs/${id}/summary`);

        return response.data.data;
      },
      enabled: !!id,
    });
  },
};
