import "server-only";

import { NextRequest } from "next/server";
import { streamEventsService } from "./events.service";
import env from "@/common/config/environtment";
import { responseFormatter } from "@/lib/response-formatter";
import { handleException } from "@/common/exception/helper";

export const streamEventsController = async (request: NextRequest): Promise<Response> => {
  try {
    if (!env.API_KEY) {
      return responseFormatter.error({
        message: "Missing API_KEY",
      });
    }

    const simulationId = request.nextUrl.searchParams.get("simulationId") ?? undefined;
    const res = await streamEventsService(request.signal, simulationId);

    if (!res.ok) {
      const detail = await res.text().catch(() => "Failed to read upstream response");

      return responseFormatter.error({
        message: `Upstream error (${res.status}): ${detail}`,
        status: 502,
      });
    }

    if (!res.body) {
      return responseFormatter.error({
        message: "No stream",
      });
    }

    const reader = res.body.getReader();

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        controller.enqueue(encoder.encode(": connected\n\n"));

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            if (value) controller.enqueue(value);
          }
        } catch {
          if (!request.signal.aborted) {
            controller.error(new Error("Failed to read SSE upstream stream"));
            return;
          }
        } finally {
          reader.releaseLock();
        }

        controller.close();
      },
      async cancel() {
        await reader.cancel();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return handleException(error);
  }
};
