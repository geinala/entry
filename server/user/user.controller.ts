"use server";

import { NextResponse } from "next/server";
import { findUserWithRoleAndPermissionsService, validateUserService } from "./user.service";
import { clerkClient } from "@clerk/nextjs/server";

export const onBoardingUserController = async (clerkUserId?: string): Promise<NextResponse> => {
  try {
    const client = await clerkClient();

    if (!clerkUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await validateUserService(clerkUserId);

    if (user) {
      return NextResponse.json({ registered: true, redirectTo: "/dashboard" }, { status: 200 });
    }

    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { onboardingCompleted: false },
    });

    return NextResponse.json({ registered: false, redirectTo: "/onboarding" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};

export const getUserDetailsController = async (clerkUserId?: string): Promise<NextResponse> => {
  try {
    if (!clerkUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserWithRoleAndPermissionsService(clerkUserId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};
