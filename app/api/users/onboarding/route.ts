"use server";

import { handleAuthenticatedRequest } from "@/lib/request";
import { onBoardingUserController } from "@/server/user/user.controller";
import { NextRequest } from "next/server";

// POST: /users/onboarding
export const POST = async (req: NextRequest) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: (_, data) => {
      const { clerkUserId } = data;
      return onBoardingUserController(clerkUserId);
    },
  });
};
