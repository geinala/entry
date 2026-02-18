"use server";

import { handleAuthenticatedRequest } from "@/lib/request";
import {
  createWaitlistEntryController,
  getWaitlistEntriesWithPaginationController,
  updateWaitlistEntriesStatusController,
} from "@/server/waitlist/waitlist.controller";
import { NextRequest } from "next/server";

// POST: /waitlist
export const POST = async (req: NextRequest) => {
  return await createWaitlistEntryController(req);
};

// GET: /waitlist
export const GET = async (req: NextRequest) => {
  return handleAuthenticatedRequest({
    request: req,
    callback: async () => {
      return await getWaitlistEntriesWithPaginationController(req);
    },
  });
};

// PATCH /waitlist
export const PATCH = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: updateWaitlistEntriesStatusController,
  });
};
