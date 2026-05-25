import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { REOPTIMIZATION_EVENT_QUERIES } from "../_api/queries";

export const useGetRouteSegmentCongestionQuery = (
  simulationId: string,
  congestionCheckId: number,
) => {
  const api = useAuthenticatedClient();

  return useQuery(
    REOPTIMIZATION_EVENT_QUERIES.getRouteSegmentCongestion({
      api,
      simulationId,
      congestionCheckId,
    }),
  );
};

export const useGetRouteSegmentCongestionIncidentsQuery = (
  simulationId: string,
  congestionCheckId: number,
) => {
  const api = useAuthenticatedClient();

  return useQuery(
    REOPTIMIZATION_EVENT_QUERIES.getRouteSegmentCongestionIncidents({
      api,
      simulationId,
      congestionCheckId,
    }),
  );
};

export const useGetIncidentRouteSegmentByTomTomIdsQuery = (
  simulationId: string,
  tomTomSegmentIds?: string[],
) => {
  const api = useAuthenticatedClient();

  return useQuery(
    REOPTIMIZATION_EVENT_QUERIES.getIncidentRouteSegmentByTomTomIds({
      api,
      simulationId,
      tomTomSegmentIds,
    }),
  );
};

export const useGetRouteSegmentAffectedIncidentsQuery = (
  simulationId: string,
  congestionCheckId: number,
) => {
  const api = useAuthenticatedClient();

  return useQuery(
    REOPTIMIZATION_EVENT_QUERIES.getRouteSegmentAffectedIncidents({
      api,
      simulationId,
      congestionCheckId,
    }),
  );
};

export const useGetFullRouteComparisonQuery = (simulationId: string, congestionCheckId: number) => {
  const api = useAuthenticatedClient();

  return useQuery(
    REOPTIMIZATION_EVENT_QUERIES.getFullRouteComparison({
      api,
      simulationId,
      congestionCheckId,
    }),
  );
};
