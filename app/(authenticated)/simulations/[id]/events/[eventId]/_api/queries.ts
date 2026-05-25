import {
  TFullRouteComparison,
  TRouteLeg,
  TRouteLegCongestionCheckIncident,
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
    congestionCheckId,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    congestionCheckId?: number;
  }) => {
    return queryOptions({
      queryKey: ["route-segment-congestion", simulationId, congestionCheckId],
      queryFn: async (): Promise<TRouteSegmentWithBoundingBox> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TRouteSegmentWithBoundingBox>> =
          await api.get(
            `/simulations/${simulationId}/reoptimizations/events/${congestionCheckId}/routes/segments`,
          );
        return response.data.data;
      },
      enabled: !!simulationId && !!congestionCheckId,
    });
  },
  getRouteSegmentCongestionIncidents: ({
    api,
    simulationId,
    congestionCheckId,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    congestionCheckId?: number;
  }) => {
    return queryOptions({
      queryKey: ["route-segment-congestion-incidents", simulationId, congestionCheckId],
      queryFn: async (): Promise<TRouteLegCongestionCheckIncident[]> => {
        const response: AxiosResponse<
          TApiSuccessResponseWithData<TRouteLegCongestionCheckIncident[]>
        > = await api.get(
          `/simulations/${simulationId}/reoptimizations/events/${congestionCheckId}/routes/segments/congestions/detail`,
        );

        return response.data.data;
      },
      enabled: !!simulationId && !!congestionCheckId,
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
    congestionCheckId,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    congestionCheckId?: number;
  }) => {
    return queryOptions({
      queryKey: ["route-segment-affected-incidents", simulationId, congestionCheckId],
      queryFn: async (): Promise<
        | {
            beforeRoute: TRouteLeg;
            afterRoute: TRouteLeg;
            timeSavedInSeconds: number;
          }
        | undefined
      > => {
        const response: AxiosResponse<
          TApiSuccessResponseWithData<
            | {
                beforeRoute: TRouteLeg;
                afterRoute: TRouteLeg;
                timeSavedInSeconds: number;
              }
            | undefined
          >
        > = await api.get(
          `/simulations/${simulationId}/reoptimizations/events/${congestionCheckId}/routes/segments/congestions/affected`,
        );

        return response.data.data || undefined;
      },
      enabled: !!simulationId && !!congestionCheckId,
    });
  },
  getFullRouteComparison: ({
    api,
    simulationId,
    congestionCheckId,
  }: {
    api: AxiosInstance;
    simulationId?: string;
    congestionCheckId?: number;
  }) => {
    return queryOptions({
      queryKey: ["full-route-comparison", simulationId, congestionCheckId],
      queryFn: async (): Promise<TFullRouteComparison> => {
        const response: AxiosResponse<TApiSuccessResponseWithData<TFullRouteComparison>> =
          await api.get(
            `/simulations/${simulationId}/reoptimizations/events/${congestionCheckId}/routes`,
          );

        return response.data.data;
      },
      enabled: !!simulationId && !!congestionCheckId,
    });
  },
};
