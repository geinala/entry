import "server-only";

import {
  getFullRouteComparisonRepository,
  getIncidentRouteSegmentByTomTomIdsRepository,
  getRouteSegmentAffectedIncidentsRepository,
  getRouteSegmentCongestionCheckMatchDetailsRepository,
  getRouteSegmentWithBoundingBoxRepository,
} from "./event.repository";

export const getRouteSegmentWithBoundingBoxService = async (
  simulationId: string,
  eventId: number,
) => {
  return await getRouteSegmentWithBoundingBoxRepository(simulationId, eventId);
};

export const getRouteSegmentCongestionCheckMatchDetailsService = async (
  simulationId: string,
  eventId: number,
) => {
  return await getRouteSegmentCongestionCheckMatchDetailsRepository(simulationId, eventId);
};

export const getIncidentRouteSegmentByTomTomIdsService = async (
  simulationId: string,
  tomTomSegmentIds: string[],
) => {
  return await getIncidentRouteSegmentByTomTomIdsRepository(simulationId, tomTomSegmentIds);
};

export const getRouteSegmentAffectedIncidentsService = async (
  simulationId: string,
  eventId: number,
) => {
  return await getRouteSegmentAffectedIncidentsRepository(simulationId, eventId);
};

export const getFullRouteComparisonService = async (simulationId: string, eventId: number) => {
  return await getFullRouteComparisonRepository(simulationId, eventId);
};
