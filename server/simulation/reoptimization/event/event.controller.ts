import { handleException } from "@/common/exception/helper";
import {
  getFullRouteComparisonService,
  getIncidentRouteSegmentByTomTomIdsService,
  getRouteSegmentAffectedIncidentsService,
  getRouteSegmentCongestionCheckMatchDetailsService,
  getRouteSegmentWithBoundingBoxService,
  hasIncidentsService,
} from "./event.service";
import { responseFormatter } from "@/lib/response-formatter";
import { BadRequestException } from "@/common/exception/bad-request.exception";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { TRouteLegCongestionCheckIncidentWithIncidentDetails } from "@/types/database";

export const getRouteSegmentWithBoundingBoxController = async (
  simulationId: string,
  congestionCheckId: number,
) => {
  try {
    await hasIncidentsService(congestionCheckId);

    const result = await getRouteSegmentWithBoundingBoxService(simulationId, congestionCheckId);

    return responseFormatter.successWithData({
      data: result,
      message: "Route segment with bounding box retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getRouteSegmentCongestionCheckMatchDetailsController = async (
  congestionCheckId: number,
) => {
  try {
    await hasIncidentsService(congestionCheckId);

    const result = await getRouteSegmentCongestionCheckMatchDetailsService(congestionCheckId);

    const mappedResult: TRouteLegCongestionCheckIncidentWithIncidentDetails[] = result.map(
      (item) => ({
        ...item.route_leg_congestion_check_incidents,
        trafficIncident: {
          ...item.traffic_incidents,
        },
      }),
    );

    return responseFormatter.successWithData<TRouteLegCongestionCheckIncidentWithIncidentDetails[]>(
      {
        data: mappedResult,
        message: "Route segment congestion check match details retrieved successfully",
      },
    );
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

    let resolvedTomTomSegmentIds = tomTomSegmentIds;

    if (resolvedTomTomSegmentIds.length === 0 && bracketedTomTomSegmentIds.length > 0) {
      resolvedTomTomSegmentIds = bracketedTomTomSegmentIds;
    }

    if (resolvedTomTomSegmentIds.length === 0 && commaSeparatedTomTomSegmentIds) {
      resolvedTomTomSegmentIds = commaSeparatedTomTomSegmentIds;
    }

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
  congestionCheckId: number,
) => {
  try {
    await hasIncidentsService(congestionCheckId);

    const result = await getRouteSegmentAffectedIncidentsService(simulationId, congestionCheckId);

    return responseFormatter.successWithData({
      data: result,
      message: "Route segment affected incidents retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getFullRouteComparisonController = async (
  simulationId: string,
  congestionCheckId: number,
) => {
  try {
    await hasIncidentsService(congestionCheckId);

    const result = await getFullRouteComparisonService(simulationId, congestionCheckId);

    return responseFormatter.successWithData({
      data: result,
      message: "Full route comparison retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
