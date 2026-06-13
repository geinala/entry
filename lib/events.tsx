import { QueryClient } from "@tanstack/react-query";
import { SIMULATIONS_QUERY_KEYS } from "@/app/(authenticated)/simulations/_api/queries";

type TEventPayload = Record<string, unknown> | string | null;

const isSimulationEventPayload = (
  payload: TEventPayload,
): payload is Record<string, unknown> & { simulationId: string } => {
  return (
    typeof payload === "object" && payload !== null && typeof payload.simulationId === "string"
  );
};

export const shouldHandleSimulationEvent = (payload: TEventPayload, simulationId: string) => {
  if (!isSimulationEventPayload(payload)) {
    return false;
  }

  return payload.simulationId === simulationId;
};

type TEventHandlerContext = {
  queryClient: QueryClient;
  payload: TEventPayload;
  simulationId: string;
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
      queryKey: ["final-routes", simulationId],
    });

    queryClient.invalidateQueries({
      queryKey: SIMULATIONS_QUERY_KEYS.findById(simulationId),
    });
  },
  VEHICLE_ARRIVED: ({ queryClient, simulationId }) => {
    queryClient.invalidateQueries({
      queryKey: ["final-routes", simulationId],
    });

    queryClient.invalidateQueries({
      queryKey: SIMULATIONS_QUERY_KEYS.findById(simulationId),
    });
  },
  REOPTIMIZATION_TRIGGERED: ({ queryClient, simulationId }) => {
    setTimeout(() => {
      queryClient.refetchQueries({
        queryKey: ["final-routes", simulationId],
      });

      queryClient.refetchQueries({
        queryKey: SIMULATIONS_QUERY_KEYS.findById(simulationId),
      });
    }, 500);
  },
  VEHICLE_RETURNED_TO_DEPOT: ({ queryClient, simulationId }) => {
    queryClient.invalidateQueries({
      queryKey: ["final-routes", simulationId],
    });

    queryClient.invalidateQueries({
      queryKey: SIMULATIONS_QUERY_KEYS.findById(simulationId),
    });
  },
};

export const EVENT_TYPES = Object.keys(eventHandlers);
