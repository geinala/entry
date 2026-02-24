import "server-only";

import { handleAuthenticatedRequest } from "@/lib/request";
import { uploadFileController } from "@/server/files/files.controller";
import { NextRequest } from "next/server";

// POST /files - Upload a file to MinIO
export const POST = async (request: NextRequest) => {
  return await handleAuthenticatedRequest({
    request,
    callback: uploadFileController,
  });
};
