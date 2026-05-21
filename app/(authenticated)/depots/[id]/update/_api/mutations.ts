import { TCreateOrUpdateDepotSchema } from "@/schemas/depot.schema";
import { TDepot } from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const UPDATE_DEPOT_MUTATIONS = {
  update: (api: AxiosInstance, queryClient: QueryClient, router: ReturnType<typeof useRouter>) => {
    return mutationOptions({
      mutationFn: async ({ id, data }: { id: number; data: TCreateOrUpdateDepotSchema }) => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TDepot>> = await api.patch(
          `/depots/${id}`,
          data,
        );

        return response.data;
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["depots"] });

        toast.success("Depot updated successfully!");
        router.push(`/depots/${data.data.id}`);
      },
    });
  },
};
