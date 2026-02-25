"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { simulationQueries } from "../_api/queries";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useGetInfiniteSimulationsQuery = (queryParams: TIndexSimulationQueryParams) => {
  const api = useAuthenticatedClient();

  return useInfiniteQuery(simulationQueries.list(api, queryParams));
};

export const useGetSimulationByIdQuery = (id?: string) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationQueries.findById(api, id));
};
