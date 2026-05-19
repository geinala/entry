import { handleAuthenticatedRequest } from "@/lib/request";
import {
  deleteDraftSimulationJobController,
  getDraftSimulationJobController,
} from "@/server/simulation/job/draft/draft.controller";
import { NextRequest } from "next/server";

// GET /simulations/jobs/draft
export const GET = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async (_, context) => {
      return await getDraftSimulationJobController(context.clerkUserId);
    },
  });
};

// DELETE /simulations/jobs/draft
export const DELETE = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: async (_, context) => {
      return await deleteDraftSimulationJobController(context.clerkUserId);
    },
  });
};
