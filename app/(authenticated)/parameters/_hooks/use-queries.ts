import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { TIndexParameterQueryParams } from "@/schemas/parameter.schema";
import { GET_PARAMETER_QUERIES } from "../_api/queries";

export const useGetParametersWithPaginationQuery = (queryParams: TIndexParameterQueryParams) => {
  const api = useAuthenticatedClient();

  return useQuery(GET_PARAMETER_QUERIES.getParametersWithPagination(api, queryParams));
};
