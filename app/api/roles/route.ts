import { handleAuthenticatedRequest } from "@/lib/request";
import { getRolesWithPaginationController } from "@/server/role/role.controller";
import { NextRequest } from "next/server";

// GET /roles
export const GET = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: async (req, context) => {
      return getRolesWithPaginationController(context.clerkUserId, req);
    },
  });
};
