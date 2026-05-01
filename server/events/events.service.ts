import "server-only";

import env from "@/common/config/environtment";

export const streamEventsService = async (signal: AbortSignal, simulationId?: string) => {
  const url = new URL("/api/events/stream", env.BACKEND_API_URL);

  if (simulationId) {
    url.searchParams.set("simulation_id", simulationId);
  }

  return fetch(url, {
    headers: {
      Accept: "text/event-stream",
      "X-API-KEY": env.API_KEY,
    },
    cache: "no-store",
    signal,
  });
};
