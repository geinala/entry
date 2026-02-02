"use server";

import { NextRequest, NextResponse } from "next/server";
import {
  findUserWithRoleAndPermissionsService,
  getUsersWithPaginationService,
  validateUserService,
} from "./user.service";
import { authService } from "@/services/auth.service";
import { parseQueryParams } from "@/lib/validation";
import { GetUsersQueryParams } from "./user.schema";
import { parseSortParams } from "@/lib/query-param";

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

export const getUsersWithPaginationController = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(req.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
    };

    const result = parseQueryParams(GetUsersQueryParams, rawQueryParams);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid query parameters" }, { status: 400 });
    }

    const users = await getUsersWithPaginationService(result.data);

    return NextResponse.json(users, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};
