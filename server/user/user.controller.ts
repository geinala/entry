"use server";

import { NextResponse } from "next/server";
import { findUserWithRoleAndPermissionsService, validateUserService } from "./user.service";
import { authService } from "@/services/auth.service";

export const onBoardingUserController = async (clerkUserId: string): Promise<NextResponse> => {
  try {
    const user = await validateUserService(clerkUserId);

    if (user) {
      return NextResponse.json({ registered: true, redirectTo: "/dashboard" }, { status: 200 });
    }

    await authService.updateUserMetadata(clerkUserId, { onboardingStarted: true });

    return NextResponse.json({ registered: false, redirectTo: "/onboarding" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};

export const getUserDetailsController = async (
  clerkUserId: string,
  sessionId: string,
): Promise<NextResponse> => {
  try {
    const user = await findUserWithRoleAndPermissionsService(clerkUserId);

    if (!user) {
      await authService.revokeSession(sessionId);

      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};
