import { TCreateOrUpdateDepotSchema } from "@/schemas/depot.schema";
import { TDepot } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CREATE_DEPOT_MUTATION = {
  create: (api: AxiosInstance, queryClient: QueryClient, router: ReturnType<typeof useRouter>) => {
    return mutationOptions({
      mutationFn: async (data: TCreateOrUpdateDepotSchema) => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TDepot>> = await api.post(
          "/depots",
          data,
        );

        return response.data;
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: ["depots"] });

        toast.success(data.message);
        router.push("/depots");
      },
    });
  },
};
