import { handleAuthenticatedRequest } from "@/lib/request";
import { createSimulationController } from "@/server/simulation/simulation.controller";
import { NextRequest } from "next/server";

// POST /simulations
export const POST = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: async (request, context) => {
      return await createSimulationController(context.clerkUserId, request);
    },
  });
};
