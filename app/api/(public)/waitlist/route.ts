"use server";

import { createWaitlistEntryController } from "@/server/waitlist/waitlist.controller";
import { NextRequest } from "next/server";

// POST: /waitlist
export const POST = async (req: NextRequest) => {
  return await createWaitlistEntryController(req);
};
