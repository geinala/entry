"use server";

import { parseQueryParams, validateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import { GetWaitlistQueryParams, WaitlistFormSchema } from "./waitlist.schema";
import {
  createWaitlistEntryService,
  getWaitlistEntriesWithPaginationService,
} from "./waitlist.service";
import { parseSortParams } from "@/lib/query-param";

export const createWaitlistEntryController = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const result = validateSchema(WaitlistFormSchema, body);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    await createWaitlistEntryService(result.data);

    return NextResponse.json({ message: "Waitlist entry created successfully" }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
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
    };

    const result = parseQueryParams(GetWaitlistQueryParams, rawQueryParams);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid query parameters" }, { status: 400 });
    }

    const queryParams = result.data;

    const data = await getWaitlistEntriesWithPaginationService(queryParams);

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
};
