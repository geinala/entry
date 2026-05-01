import { handleAuthenticatedRequest } from "@/lib/request";
import { createSimulationJobController } from "@/server/simulation/job/simulation-job.controller";
import { NextRequest } from "next/server";

// simulations/jobs
export const POST = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async (_, context) => {
      return await createSimulationJobController(request, context.clerkUserId);
    },
  });
};
