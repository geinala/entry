import "server-only";

import { parseQueryParams, validateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import {
  createWaitlistEntryService,
  getWaitlistEntriesWithPaginationService,
  getWaitlistEntryByEmailService,
  updateWaitlistEntriesStatusService,
} from "./waitlist.service";
import { parseSortParams } from "@/lib/query-param";
import { responseFormatter } from "@/lib/response-formatter";
import { TWaitlistEntry } from "@/types/database";
import {
  GetWaitlistQueryParams,
  TUpdateWaitlist,
  TWaitlistForm,
  UpdateWaitlistSchema,
  WaitlistFormSchema,
} from "@/schemas/waitlist.schema";
import { getWaitlistEntriesSummaryRepository } from "./waitlist.repository";
import { checkUserPermissionsService } from "../permission/permission.service";
import { PERMISSIONS } from "@/common/constants/permissions/permissions";
import { handleException } from "@/common/exception/helper";

export const createWaitlistEntryController = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();

    const { data } = validateSchema<TWaitlistForm>(WaitlistFormSchema, body);

    const existingEntry = await getWaitlistEntryByEmailService(data.email);

    if (existingEntry) {
      return responseFormatter.conflict("An entry with this email already exists in the waitlist");
    }

    const waitlistEntry = await createWaitlistEntryService(data);

    return responseFormatter.created({
      data: waitlistEntry[0],
      message: "Successfully joined the waitlist",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getWaitlistEntriesWithPaginationController = async (
  clerkUserId: string,
  req: NextRequest,
): Promise<NextResponse> => {
  try {
    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.VIEW_WAITLIST]);

    const { searchParams } = new URL(req.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
      status: searchParams.get("status") || "pending",
    };

    const result = parseQueryParams(GetWaitlistQueryParams, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid query parameters",
      });
    }

    const queryParams = result.data;

    const { data, meta } = await getWaitlistEntriesWithPaginationService(queryParams);
    const summary = await getWaitlistEntriesSummaryRepository();

    return responseFormatter.successWithPagination<TWaitlistEntry>({
      data,
      meta,
      message: "Waitlist entries retrieved successfully",
      summary,
    });
  } catch (error) {
    return handleException(error);
  }
};

export const denyWaitlistEntriesController = async (clerkUserId: string, req: NextRequest) => {
  try {
    await checkUserPermissionsService(clerkUserId, [PERMISSIONS.DENY_WAITLIST]);

    const body = await req.json();

    const { data } = validateSchema<TUpdateWaitlist>(UpdateWaitlistSchema, body);

    await updateWaitlistEntriesStatusService(data);

    return responseFormatter.success({
      message: "Waitlist entries updated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
