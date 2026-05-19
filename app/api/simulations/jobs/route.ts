import { handleAuthenticatedRequest } from "@/lib/request";
import {
  createSimulationJobController,
  getSimulationJobsByUserIdAndStatusController,
} from "@/server/simulation/job/job.controller";
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

// simulations/jobs
export const GET = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async (_, context) => {
      return await getSimulationJobsByUserIdAndStatusController(request, context.clerkUserId);
    },
  });
};
