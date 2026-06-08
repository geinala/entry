import { TIndexParameterQueryParams } from "@/schemas/parameter.schema";
import { TTuningExperimentDataset } from "@/types/database";
import { TPaginationResponse } from "@/types/meta";
import { TApiSuccessResponseWithData, TApiSuccessResponseWithPagination } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

export const GET_PARAMETER_QUERIES = {
  getParametersWithPagination: (api: AxiosInstance, queryParams: TIndexParameterQueryParams) => {
    return queryOptions({
      queryKey: ["parameters", queryParams],
      queryFn: async (): Promise<TPaginationResponse<TTuningExperimentDataset>> => {
        const response: AxiosResponse<TApiSuccessResponseWithPagination<TTuningExperimentDataset>> =
          await api.get("/parameters", {
            params: queryParams,
          });

        return response.data.data;
      },
    });
  },
  getParameterById: (api: AxiosInstance, id: string) => {
    return queryOptions({
      queryKey: ["parameters", id],
      queryFn: async (): Promise<TTuningExperimentDataset> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TTuningExperimentDataset>> =
          await api.get(`/parameters/${id}`);

        return response.data.data;
      },
      enabled: !!id,
    });
  },
};
