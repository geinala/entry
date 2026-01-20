"use server";

import { NextResponse } from "next/server";
import { validateUserService } from "./user.service";
import { clerkClient } from "@clerk/nextjs/server";

export const onBoardingUserController = async (clerkUserId?: string): Promise<NextResponse> => {
  try {
    const client = await clerkClient();

    if (!clerkUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await validateUserService(clerkUserId);

    if (user) {
      // TODO: Redirect by role
      return NextResponse.json({ registered: true, redirectTo: "/history" }, { status: 200 });
    }

    await client.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { onboardingCompleted: false },
    });

    return NextResponse.json({ registered: false, redirectTo: "/onboarding" }, { status: 200 });
  } catch (error) {
    console.error("Error in onBoardingUserController:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};
