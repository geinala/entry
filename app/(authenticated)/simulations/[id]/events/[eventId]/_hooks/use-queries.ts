import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { REOPTIMIZATION_EVENT_QUERIES } from "../_api/queries";

export const useGetRouteSegmentCongestionQuery = (simulationId: string, eventId: number) => {
  const api = useAuthenticatedClient();

  return useQuery(
    REOPTIMIZATION_EVENT_QUERIES.getRouteSegmentCongestion({
      api,
      simulationId,
      eventId,
    }),
  );
};

export const useGetRouteSegmentCongestionCheckMatchDetailsQuery = (
  simulationId: string,
  eventId: number,
) => {
  const api = useAuthenticatedClient();

  return useQuery(
    REOPTIMIZATION_EVENT_QUERIES.getRouteSegmentCongestionCheckMatchDetails({
      api,
      simulationId,
      eventId,
    }),
  );
};

export const useGetIncidentRouteSegmentByTomTomIdsQuery = (
  simulationId: string,
  tomTomSegmentIds: string[],
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

export const useGetRouteSegmentAffectedIncidentsQuery = (simulationId: string, eventId: number) => {
  const api = useAuthenticatedClient();

  return useQuery(
    REOPTIMIZATION_EVENT_QUERIES.getRouteSegmentAffectedIncidents({
      api,
      simulationId,
      eventId,
    }),
  );
};

export const useGetFullRouteComparisonQuery = (simulationId: string, eventId: number) => {
  const api = useAuthenticatedClient();

  return useQuery(
    REOPTIMIZATION_EVENT_QUERIES.getFullRouteComparison({
      api,
      simulationId,
      eventId,
    }),
  );
};
