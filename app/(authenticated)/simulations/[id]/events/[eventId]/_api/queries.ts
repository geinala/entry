import {
  TFullRouteComparison,
  TIncidentMatchDetail,
  TRouteLeg,
  TRouteSegmentWithBoundingBox,
  TTrafficIncident,
} from "@/types/database";
import { TApiSuccessResponseWithData } from "@/types/response";
import { queryOptions } from "@tanstack/react-query";
import { AxiosInstance, AxiosResponse } from "axios";

export const REOPTIMIZATION_EVENT_QUERIES = {
  getRouteSegmentCongestion: ({
    api,
    simulationId,
    eventId,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    eventId?: number;
  }) => {
    return queryOptions({
      queryKey: ["route-segment-congestion", simulationId, eventId],
      queryFn: async (): Promise<TRouteSegmentWithBoundingBox> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TRouteSegmentWithBoundingBox>> =
          await api.get(
            `/simulations/${simulationId}/reoptimizations/events/${eventId}/routes/segments`,
          );
        return response.data.data;
      },
      enabled: !!simulationId && !!eventId,
    });
  },
  getRouteSegmentCongestionCheckMatchDetails: ({
    api,
    simulationId,
    eventId,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    eventId?: number;
  }) => {
    return queryOptions({
      queryKey: ["route-segment-congestion-match-details", simulationId, eventId],
      queryFn: async (): Promise<TIncidentMatchDetail> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TIncidentMatchDetail>> =
          await api.get(
            `/simulations/${simulationId}/reoptimizations/events/${eventId}/routes/segments/congestions/detail`,
          );

        return response.data.data;
      },
      enabled: !!simulationId && !!eventId,
    });
  },
  getIncidentRouteSegmentByTomTomIds: ({
    api,
    simulationId,
    tomTomSegmentIds,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    tomTomSegmentIds?: string[];
  }) => {
    return queryOptions({
      queryKey: ["incident-route-segment-by-tomtom-ids", simulationId, tomTomSegmentIds],
      queryFn: async (): Promise<TTrafficIncident[]> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TTrafficIncident[]>> =
          await api.get(`/simulations/${simulationId}/reoptimizations/events/incidents`, {
            params: {
              tomTomSegmentIds,
            },
          });

        return response.data.data;
      },
      enabled: !!simulationId && !!tomTomSegmentIds && tomTomSegmentIds.length > 0,
    });
  },
  getRouteSegmentAffectedIncidents: ({
    api,
    simulationId,
    eventId,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    eventId?: number;
  }) => {
    return queryOptions({
      queryKey: ["route-segment-affected-incidents", simulationId, eventId],
      queryFn: async (): Promise<{
        beforeRoute: TRouteLeg;
        afterRoute: TRouteLeg;
        timeSavedInSeconds: number;
      }> => {
        const response: AxiosResponse<
          TApiSuccessResponseWithData<{
            beforeRoute: TRouteLeg;
            afterRoute: TRouteLeg;
            timeSavedInSeconds: number;
          }>
        > = await api.get(
          `/simulations/${simulationId}/reoptimizations/events/${eventId}/routes/segments/congestions/affected`,
        );

        return response.data.data;
      },
      enabled: !!simulationId && !!eventId,
    });
  },
  getFullRouteComparison: ({
    api,
    simulationId,
    eventId,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    eventId?: number;
  }) => {
    return queryOptions({
      queryKey: ["full-route-comparison", simulationId, eventId],
      queryFn: async (): Promise<TFullRouteComparison> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TFullRouteComparison>> =
          await api.get(`/simulations/${simulationId}/reoptimizations/events/${eventId}/routes`);

        return response.data.data;
      },
      enabled: !!simulationId && !!eventId,
    });
  },
};
