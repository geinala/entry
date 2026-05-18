import { TBulkErrorRowsSchema } from "@/schemas/simulations/jobs/bulk-error-rows.schema";
import { TCreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { TUpdateSimulationJobSchema } from "@/schemas/simulations/jobs/update-simulation-job.schema";
import { TUpdateSimulationUploadedRowSchema } from "@/schemas/simulations/jobs/update-simulation-uploaded-row.schema";
import { TSimulationJob, TSimulationUploadedRow } from "@/types/database";
import { TApiSuccessResponseWithData, TBaseApiResponse } from "@/types/response";
import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "sonner";

export const createSimulationJobMutations = {
  createSimulationJob: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (
        payload: TCreateSimulationJobSchema,
      ): Promise<TApiSuccessResponseWithData<TSimulationJob>> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TSimulationJob>> = await api.post(
          "/simulations/jobs",
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
  updateSimulationJob: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async ({
        simulationJobId,
        payload,
      }: {
        simulationJobId: string;
        payload: TUpdateSimulationJobSchema;
      }): Promise<TApiSuccessResponseWithData<TSimulationJob>> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TSimulationJob>> =
          await api.patch(`/simulations/jobs/${simulationJobId}`, payload);

        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
  updateSimulationUploadedRow: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async ({
        jobId,
        rowId,
        payload,
      }: {
        jobId: string;
        rowId: number;
        payload: TUpdateSimulationUploadedRowSchema;
      }): Promise<TApiSuccessResponseWithData<TSimulationUploadedRow>> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TSimulationUploadedRow>> =
          await api.patch(`/simulations/jobs/${jobId}/files/rows/${rowId}`, payload);

        return response.data;
      },
      onSuccess: (data, variables) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulationUploadedRows", variables.jobId] });
        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
  deleteSimulationUploadedRow: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async ({
        jobId,
        rowId,
      }: {
        jobId: string;
        rowId: number;
      }): Promise<TBaseApiResponse> => {
        /* eslint-disable drizzle/enforce-delete-with-where */
        const response: AxiosResponse<TBaseApiResponse> = await api.delete(
          `/simulations/jobs/${jobId}/files/rows/${rowId}`,
        );

        return response.data;
      },
      onSuccess: (data, variables) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulationUploadedRows", variables.jobId] });
        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
  deleteAllSimulationUploadedErrorsAndContinue: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (jobId: string) => {
        const response: AxiosResponse<TBaseApiResponse> = await api.delete(
          `/simulations/jobs/${jobId}/files/validates`,
        );

        return response.data;
      },
      onSuccess: (data, jobId) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulationUploadedRows", jobId] });
        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
  bulkDeleteSelectedErrorRows: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async ({ jobId, schema }: { jobId: string; schema: TBulkErrorRowsSchema }) => {
        const response: AxiosResponse<TBaseApiResponse> = await api.delete(
          `/simulations/jobs/${jobId}/files/rows/delete/bulk`,
          {
            data: {
              rowIds: schema.rowIds,
            },
          },
        );

        return response.data;
      },
      onSuccess: (data, variables) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulationUploadedRows", variables.jobId] });
        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
  bulkIgnoreSelectedErrorRows: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async ({ jobId, schema }: { jobId: string; schema: TBulkErrorRowsSchema }) => {
        const response: AxiosResponse<TBaseApiResponse> = await api.post(
          `/simulations/jobs/${jobId}/files/rows/ignore/bulk`,
          {
            rowIds: schema.rowIds,
          },
        );

        return response.data;
      },
      onSuccess: (data, variables) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulationUploadedRows", variables.jobId] });
        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
  ignoreAllErrorsAddressAndContinue: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (jobId: string) => {
        const response: AxiosResponse<TBaseApiResponse> = await api.post(
          `/simulations/jobs/${jobId}/files/rows/ignore`,
        );

        return response.data;
      },
      onSuccess: (data, jobId) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulationUploadedRows", jobId] });
        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
  ignoreAddressErrorRow: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async ({
        jobId,
        rowId,
      }: {
        jobId: string;
        rowId: number;
      }): Promise<TBaseApiResponse> => {
        const response: AxiosResponse<TBaseApiResponse> = await api.post(
          `/simulations/jobs/${jobId}/files/rows/${rowId}/ignore`,
        );

        return response.data;
      },
      onSuccess: (data, variables) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["simulationUploadedRows", variables.jobId] });
        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] as const });
      },
    });
  },
};
