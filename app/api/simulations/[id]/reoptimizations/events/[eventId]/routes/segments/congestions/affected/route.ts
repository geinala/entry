import { handleAuthenticatedRequest } from "@/lib/request";
import { getRouteSegmentAffectedIncidentsController } from "@/server/simulation/reoptimization/event/event.controller";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ id: string; eventId: string }> },
) => {
  const { id, eventId } = await context.params;

  return handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getRouteSegmentAffectedIncidentsController(id, Number(eventId));
    },
  });
};
