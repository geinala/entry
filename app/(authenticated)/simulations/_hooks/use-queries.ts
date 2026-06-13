"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { simulationQueries } from "../_api/queries";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { TOptimizationSummaryParams } from "@/schemas/simulations/optimization-summary.schema";
import { TReoptimizationEventTableIndexQueryParams } from "@/schemas/simulations/reoptimization-event.schema";
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

export const useGetGlobalSummaryAlgorithmQuery = (
  simulationId?: string,
  queryParams?: TOptimizationSummaryParams,
) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationQueries.getGlobalSummaryAlgorithm(api, simulationId, queryParams));
};

export const useGetTimeSeriesSummaryQuery = (
  simulationId?: string,
  queryParams?: TOptimizationSummaryParams,
) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationQueries.getTimeSeriesSummary(api, simulationId, queryParams));
};

export const useGetComparisonChartQuery = (simulationId?: string) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationQueries.getComparisonChartData(api, simulationId));
};

export const useGetReoptimizationEventsQuery = ({
  simulationId,
  queryParams,
}: {
  simulationId?: string;
  queryParams: TReoptimizationEventTableIndexQueryParams;
}) => {
  const api = useAuthenticatedClient();

  return useQuery(
    simulationQueries.getReoptimizationEvents({
      api,
      simulationId,
      queryParams,
    }),
  );
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
