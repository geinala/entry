import "server-only";

import env from "@/common/config/environtment";

export const streamEventsService = async (signal: AbortSignal) => {
  return fetch(`${env.BACKEND_API_URL}/events/stream`, {
    headers: {
      Accept: "text/event-stream",
      "X-API-KEY": env.API_KEY,
    },
    cache: "no-store",
    signal,
  });
};
