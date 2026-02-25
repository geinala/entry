import "server-only";

import { handleException } from "@/common/exception/helper";
import { getPresignedUrlService } from "./file.service";
import { responseFormatter } from "@/lib/response-formatter";
import { NextRequest } from "next/server";
import { validateSchema } from "@/lib/validation";
import { GetPresignedUrlParamsSchema, TGetPresignedUrlParams } from "@/schemas/file.schema";

export const getPresignedUrlController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const objectName = searchParams.get("objectName");
    const forceDownload = searchParams.get("forceDownload") === "true";

    const { data } = validateSchema<TGetPresignedUrlParams>(GetPresignedUrlParamsSchema, {
      objectName,
      forceDownload,
    });

    const result = await getPresignedUrlService(
      data.objectName,
      1 * 60 * 60, // 1 hour in seconds
      data.forceDownload,
    );

    return responseFormatter.successWithData({
      data: result,
      message: "Presigned URL generated successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
