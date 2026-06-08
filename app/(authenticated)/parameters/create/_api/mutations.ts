import { TCreateParameterSchema } from "@/schemas/parameter.schema";
import { TTuningExperimentDataset } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CREATE_PARAMETER_MUTATION = {
  create: (api: AxiosInstance, queryClient: QueryClient, router: ReturnType<typeof useRouter>) => {
    return mutationOptions({
      mutationFn: async (data: TCreateParameterSchema) => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TTuningExperimentDataset>> =
          await api.post("/parameters", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

        return response.data;
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: ["parameters"] });

        toast.success(data.message);
        router.push("/parameters");
      },
    });
  },
};
