import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { findCurrentUserByIdService, getUsersWithPaginationService } from "./user.service";
import { revokeClerkSession, updateClerkUserMetadata } from "@/server/clerk/clerk.service";
import { parseQueryParams } from "@/lib/validation";
import { parseSortParams } from "@/lib/query-param";
import { handleException } from "@/common/exception/helper";
import { responseFormatter } from "@/lib/response-formatter";
import { UserIndexQueryParams } from "@/schemas/user.schema";

export const onBoardingUserController = async (clerkUserId: string): Promise<NextResponse> => {
  try {
    const user = await findCurrentUserByIdService(clerkUserId);

    if (user) {
      return responseFormatter.successWithData({
        data: { registered: true, redirectTo: "/simulations" },
        message: "User is already registered",
      });
    }

    await updateClerkUserMetadata(clerkUserId, { is_eligible: true });

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

    return responseFormatter.successWithData({
      data: user,
      message: "User details retrieved successfully",
    });
  } catch (error) {
    if (sessionId) {
      await revokeClerkSession(sessionId);
    }

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
