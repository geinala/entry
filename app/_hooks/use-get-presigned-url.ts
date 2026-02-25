import { TGetPresignedUrlParams } from "@/schemas/file.schema";
import { useQuery } from "@tanstack/react-query";
import useAuthenticatedClient from "./use-authenticated-client";
import { TApiSuccessResponseWithData } from "@/types/response";

export const useGetPresignedUrlQuery = (payload: TGetPresignedUrlParams) => {
  const api = useAuthenticatedClient();

  return useQuery({
    queryKey: ["presignedUrl", payload.objectName],
    queryFn: async (): Promise<TApiSuccessResponseWithData<string>> => {
      return api.get("/files", { params: payload });
    },
    enabled: !!payload.objectName,
  });
};
