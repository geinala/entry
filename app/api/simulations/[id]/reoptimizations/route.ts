import "server-only";

import { handleAuthenticatedRequest } from "@/lib/request";
import { getReoptimizationEventsWithPaginationController } from "@/server/simulation/reoptimization/reoptimization.controller";
import { NextRequest } from "next/server";

// /simulations/[id]/reoptimizations
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await getReoptimizationEventsWithPaginationController(request, id);
    },
  });
};
