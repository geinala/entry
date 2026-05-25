import { handleAuthenticatedRequest } from "@/lib/request";
import { getIncidentRouteSegmentByTomTomIdsController } from "@/server/simulation/reoptimization/event/event.controller";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getIncidentRouteSegmentByTomTomIdsController(request, id);
    },
  });
};
