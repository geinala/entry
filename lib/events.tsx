import { QueryClient } from "@tanstack/react-query";
import { SIMULATION_DETAIL_QUERY_KEYS } from "@/app/(authenticated)/simulations/[id]/_api/queries";
import { SIMULATIONS_QUERY_KEYS } from "@/app/(authenticated)/simulations/_api/queries";

type TEventPayload = Record<string, unknown> | string | null;

type TEventHandlerContext = {
  queryClient: QueryClient;
  payload: TEventPayload;
  simulationId?: string;
};

type TEventHandler = (context: TEventHandlerContext) => void;

export const parseEventData = (rawData: string): TEventPayload => {
  if (!rawData) return null;

  try {
    return JSON.parse(rawData) as Record<string, unknown>;
  } catch {
    return rawData;
  }
};

export const eventHandlers: Record<string, TEventHandler> = {
  ROUTE_INITIALIZED: ({ queryClient, simulationId }) => {
    queryClient.invalidateQueries({
      queryKey: SIMULATION_DETAIL_QUERY_KEYS.getFinalRoutes(simulationId),
    });
    queryClient.invalidateQueries({
      queryKey: SIMULATIONS_QUERY_KEYS.findById(simulationId as string),
    });
  },
};

export const EVENT_TYPES = Object.keys(eventHandlers);
