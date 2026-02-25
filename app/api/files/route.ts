import "server-only";

import { handleAuthenticatedRequest } from "@/lib/request";
import { getPresignedUrlController } from "@/server/files/file.controller";
import { NextRequest } from "next/server";

// GET /api/files?objectName=xxx&&download=true
export const GET = async (request: NextRequest) => {
  return handleAuthenticatedRequest({
    request,
    callback: getPresignedUrlController,
  });
};
