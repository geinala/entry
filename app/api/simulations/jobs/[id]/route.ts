import "server-only";

import { handleAuthenticatedRequest } from "@/lib/request";
import { updateSimulationJobController } from "@/server/simulation/job/simulation-job.controller";
import { NextRequest } from "next/server";

// PATCH simulations/jobs/:id
export const PATCH = async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;

  return await handleAuthenticatedRequest({
    request,
    callback: async () => {
      return await updateSimulationJobController(request, id);
    },
  });
};
