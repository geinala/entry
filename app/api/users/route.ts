"use server";

import { getUsersWithPaginationController } from "@/server/user/user.controller";
import { NextRequest } from "next/server";

// GET: /users
export const GET = async (req: NextRequest) => {
  return getUsersWithPaginationController(req);
};
