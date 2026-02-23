import { handleAuthenticatedRequest } from "@/lib/request";
import {
  createSimulationController,
  getSimulationsController,
} from "@/server/simulation/simulation.controller";
import { NextRequest } from "next/server";

// GET /simulations
export const GET = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: async (request, context) => {
      return await getSimulationsController(context.clerkUserId, request);
    },
  });
};

// POST /simulations
export const POST = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: async (request, context) => {
      return await createSimulationController(context.clerkUserId, request);
    },
  });
};
