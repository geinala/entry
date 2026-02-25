import "server-only";

import { NextRequest } from "next/server";
import { handleAuthenticatedRequest } from "@/lib/request";
import { uploadSimulationFileController } from "@/server/simulation/simulation.controller";

// POST: /simulations/[id]/upload
export const POST = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async (_, context) => {
      return await uploadSimulationFileController(context.clerkUserId, id, request);
    },
  });
};
