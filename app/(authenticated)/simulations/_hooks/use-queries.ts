"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { simulationQueries } from "../_api/queries";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { TIndexQueryParams } from "@/types/query-params";

export const useGetInfiniteSimulationsQuery = (queryParams: TIndexSimulationQueryParams) => {
  const api = useAuthenticatedClient();

  return useInfiniteQuery(simulationQueries.list(api, queryParams));
};

export const useGetSimulationByIdQuery = (id?: string) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationQueries.findById(api, id));
};

export const useGetDraftSimulationJobQuery = () => {
  const api = useAuthenticatedClient();

  return useQuery(simulationQueries.getDraftSimulationJob(api));
};

export const useGetSimulationLogsQuery = ({
  queryParams,
  simulationId,
}: {
  queryParams: TIndexQueryParams;
  simulationId?: string;
}) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationQueries.getLogs(api, simulationId, queryParams));
};

export const useGetGlobalSummaryAlgorithmQuery = (simulationId?: string, courierId?: string) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationQueries.getGlobalSummaryAlgorithm(api, simulationId, courierId));
};
