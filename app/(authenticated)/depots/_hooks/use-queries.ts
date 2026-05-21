import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { GET_DEPOTS_QUERIES } from "../_api/queries";
import { TIndexQueryParams } from "@/types/query-params";

export const useGetDepotsWithPaginationQuery = (queryParams: TIndexQueryParams) => {
  const api = useAuthenticatedClient();

  return useQuery(GET_DEPOTS_QUERIES.getDepotsWithPagination(api, queryParams));
};

export const useGetDepotByIdQuery = (id: number) => {
  const api = useAuthenticatedClient();

  return useQuery(GET_DEPOTS_QUERIES.getDepotById(api, id));
};

export const useGetDepotOptionsQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery(GET_DEPOTS_QUERIES.getDepotOptions(api));
};
