import "server-only";

import { parseQueryParams, validateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import {
  createWaitlistEntryService,
  getWaitlistEntriesWithPaginationService,
} from "./waitlist.service";
import { parseSortParams } from "@/lib/query-param";
import { responseFormatter } from "@/lib/response-formatter";
import { TWaitlistEntry } from "@/types/database";
import { GetWaitlistQueryParams, WaitlistFormSchema } from "@/schemas/waitlist.schema";

export const createWaitlistEntryController = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();

    const result = validateSchema(WaitlistFormSchema, body);

    if (!result.success && result.error) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Invalid request data",
      });
    }

    await createWaitlistEntryService(result.data);

    return responseFormatter.created({
      message: "Successfully joined the waitlist",
    });
  } catch {
    return responseFormatter.error({
      message: "Something went wrong",
    });
  }
};

export const getWaitlistEntriesWithPaginationController = async (
  req: NextRequest,
): Promise<NextResponse> => {
  try {
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

    return responseFormatter.successWithPagination<TWaitlistEntry>({
      data,
      meta,
      message: "Waitlist entries retrieved successfully",
    });
  } catch {
    return responseFormatter.error({
      message: "Something went wrong",
    });
  }
};
