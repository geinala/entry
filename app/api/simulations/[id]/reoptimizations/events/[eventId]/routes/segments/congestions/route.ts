import { handleAuthenticatedRequest } from "@/lib/request";
import { getRouteSegmentWithBoundingBoxController } from "@/server/simulation/reoptimization/event/event.controller";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; eventId: string }> },
) => {
  const { id, eventId } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getRouteSegmentWithBoundingBoxController(id, Number(eventId));
    },
  });
};
