import { handleAuthenticatedRequest } from "@/lib/request";
import { getLatestRouteBySimulationIdController } from "@/server/route/route.controller";
import { NextRequest } from "next/server";

// GET: /simulations/[id]/routes
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getLatestRouteBySimulationIdController(id);
    },
  });
};
