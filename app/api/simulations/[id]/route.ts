import "server-only";

import { NextRequest } from "next/server";
import { handleAuthenticatedRequest } from "@/lib/request";
import {
  deleteSimulationByIdController,
  getSimulationByIdController,
} from "@/server/simulation/simulation.controller";

// GET: /simulations/[id]
export const GET = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async (_, context) => {
      return await getSimulationByIdController(context.clerkUserId, id);
    },
  });
};

// DELETE: /simulations/[id]
export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async (_, context) => {
      return await deleteSimulationByIdController(context.clerkUserId, id);
    },
  });
};
