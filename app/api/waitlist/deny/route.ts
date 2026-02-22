import { handleAuthenticatedRequest } from "@/lib/request";
import { denyWaitlistEntriesController } from "@/server/waitlist/waitlist.controller";
import { NextRequest } from "next/server";

// DELETE: /waitlist/deny/bulk
export const DELETE = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: async (req, context) => {
      return await denyWaitlistEntriesController(context.clerkUserId, req);
    },
  });
};
