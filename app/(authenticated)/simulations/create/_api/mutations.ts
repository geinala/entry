import { TCreateSimulationJobSchema } from "@/schemas/simulations/create-simulation.schema";
import { TSimulationJob } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
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

        queryClient.invalidateQueries({ queryKey: ["simulations", "draft-job"] });
      },
    });
  },
};
