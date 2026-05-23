import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { findCurrentUserByIdService, getUsersWithPaginationService } from "./user.service";
import { clerkService } from "@/server/clerk/clerk.service";
import { parseQueryParams } from "@/lib/validation";
import { parseSortParams } from "@/lib/query-param";
import { handleException } from "@/common/exception/helper";
import { UnauthorizedException } from "@/common/exception/unauthorized.exception";
import { responseFormatter } from "@/lib/response-formatter";
import { UserIndexQueryParams } from "@/schemas/user.schema";

export const onBoardingUserController = async (clerkUserId: string): Promise<NextResponse> => {
  try {
    const user = await findCurrentUserByIdService(clerkUserId);

    if (user) {
      return responseFormatter.successWithData({
        data: { registered: true, redirectTo: "/dashboard" },
        message: "User is already registered",
      });
    }

    await clerkService.updateUserMetadata(clerkUserId, { onboardingStarted: true });

    return responseFormatter.successWithData({
      data: { registered: false, redirectTo: "/onboarding" },
      message: "Onboarding started",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getUserDetailsController = async (
  clerkUserId: string,
  sessionId: string,
): Promise<NextResponse> => {
  try {
    const user = await findCurrentUserByIdService(clerkUserId);

    if (!user) {
      await clerkService.revokeSession(sessionId);

      throw new UnauthorizedException(
        "User not found. Please contact support if you believe this is an error.",
      );
    }

    return responseFormatter.successWithData({
      data: user,
      message: "User details retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
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

    const result = parseQueryParams(UserIndexQueryParams, rawQueryParams);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid query parameters" }, { status: 400 });
    }

    const { data, meta } = await getUsersWithPaginationService(result.data);

    return responseFormatter.successWithPagination({
      data: data,
      meta: meta,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
