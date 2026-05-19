import { handleAuthenticatedRequest } from "@/lib/request";
import { preOptimizeController } from "@/server/simulation/job/pre-optimize/pre-optimize.controller";
import { NextRequest } from "next/server";

// GET /simulations/jobs/[id]/pre-optimize
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return handleAuthenticatedRequest({
    request,
    callback: async (_, authData) => {
      return await preOptimizeController(authData.clerkUserId, id);
    },
  });
};
