import { handleException } from "@/common/exception/helper";
import {
  getFullRouteComparisonService,
  getIncidentRouteSegmentByTomTomIdsService,
  getRouteSegmentAffectedIncidentsService,
  getRouteSegmentCongestionCheckMatchDetailsService,
  getRouteSegmentWithBoundingBoxService,
} from "./event.service";
import { responseFormatter } from "@/lib/response-formatter";
import { BadRequestException } from "@/common/exception/bad-request.exception";
import { NextRequest } from "next/dist/server/web/spec-extension/request";

export const getRouteSegmentWithBoundingBoxController = async (
  simulationId: string,
  eventId: number,
) => {
  try {
    const result = await getRouteSegmentWithBoundingBoxService(simulationId, eventId);

    return responseFormatter.successWithData({
      data: result,
      message: "Route segment with bounding box retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getRouteSegmentCongestionCheckMatchDetailsController = async (
  simulationId: string,
  eventId: number,
) => {
  try {
    const result = await getRouteSegmentCongestionCheckMatchDetailsService(simulationId, eventId);

    return responseFormatter.successWithData({
      data: result,
      message: "Route segment congestion check match details retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getIncidentRouteSegmentByTomTomIdsController = async (
  request: NextRequest,
  simulationId: string,
) => {
  try {
    const { searchParams } = new URL(request.url);

    const tomTomSegmentIds = searchParams.getAll("tomTomSegmentIds").filter(Boolean);
    const bracketedTomTomSegmentIds = searchParams.getAll("tomTomSegmentIds[]").filter(Boolean);
    const commaSeparatedTomTomSegmentIds = searchParams
      .get("tomTomSegmentIds")
      ?.split(",")
      .map((tomTomSegmentId) => tomTomSegmentId.trim())
      .filter(Boolean);

    const resolvedTomTomSegmentIds =
      tomTomSegmentIds.length > 0
        ? tomTomSegmentIds
        : bracketedTomTomSegmentIds.length > 0
          ? bracketedTomTomSegmentIds
          : (commaSeparatedTomTomSegmentIds ?? []);

    if (resolvedTomTomSegmentIds.length === 0) {
      throw new BadRequestException("Missing required query parameter: tomTomSegmentIds");
    }

    const result = await getIncidentRouteSegmentByTomTomIdsService(
      simulationId,
      resolvedTomTomSegmentIds,
    );

    return responseFormatter.successWithData({
      data: result,
      message: "Incident route segments retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getRouteSegmentAffectedIncidentsController = async (
  simulationId: string,
  eventId: number,
) => {
  try {
    const result = await getRouteSegmentAffectedIncidentsService(simulationId, eventId);

    return responseFormatter.successWithData({
      data: result,
      message: "Route segment affected incidents retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getFullRouteComparisonController = async (simulationId: string, eventId: number) => {
  try {
    const result = await getFullRouteComparisonService(simulationId, eventId);

    return responseFormatter.successWithData({
      data: result,
      message: "Full route comparison retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
