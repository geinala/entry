import { handleAuthenticatedRequest } from "@/lib/request";
import { startOptimizationProcessController } from "@/server/simulation/job/job.controller";
import { NextRequest } from "next/server";

// POST /simulations/jobs/optimization
export const POST = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: async (_, context) => {
      return await startOptimizationProcessController(context.clerkUserId);
    },
  });
};
