import { mutationOptions, QueryClient } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "sonner";
import { TBaseApiResponse } from "@/types/response";

export const DEPOT_MUTATIONS = {
  delete: (api: AxiosInstance, queryClient: QueryClient) => {
    return mutationOptions({
      mutationFn: async (id: number) => {
        /* eslint-disable drizzle/enforce-delete-with-where */
        const response: AxiosResponse<TBaseApiResponse> = await api.delete(`/depots/${id}`);

        return response.data;
      },
      onSuccess: (data: TBaseApiResponse) => {
        toast.success(data.message);

        queryClient.invalidateQueries({ queryKey: ["depots"] });
      },
    });
  },
};
