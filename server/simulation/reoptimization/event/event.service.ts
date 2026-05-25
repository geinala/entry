import "server-only";

import {
  getFullRouteComparisonRepository,
  getIncidentRouteSegmentByTomTomIdsRepository,
  getRouteSegmentAffectedIncidentsRepository,
  getRouteSegmentCongestionCheckMatchDetailsRepository,
  getRouteSegmentWithBoundingBoxRepository,
  hasIncidentsRepository,
} from "./event.repository";
import { NotFoundException } from "@/common/exception/not-found.exception";

export const getRouteSegmentWithBoundingBoxService = async (
  simulationId: string,
  congestionCheckId: number,
) => {
  return await getRouteSegmentWithBoundingBoxRepository(simulationId, congestionCheckId);
};

export const getRouteSegmentCongestionCheckMatchDetailsService = async (eventId: number) => {
  return await getRouteSegmentCongestionCheckMatchDetailsRepository(eventId);
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

export const hasIncidentsService = async (congestionCheckId: number) => {
  try {
    const incidents = await hasIncidentsRepository(congestionCheckId);

    if (incidents.length <= 0) {
      throw new NotFoundException("No incidents found for the given congestion check ID");
    }
  } catch (error) {
    throw error;
  }
};
