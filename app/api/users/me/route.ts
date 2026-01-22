"use server";

import { handleAuthenticatedRequest } from "@/lib/request";
import { getUserDetailsController } from "@/server/user/user.controller";
import { NextRequest } from "next/server";

// GET /users/me
export const GET = async (req: NextRequest) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: (_, data) => {
      return getUserDetailsController(data.clerkUserId, data.sessionId);
    },
  });
};
