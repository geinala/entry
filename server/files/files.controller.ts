import { responseFormatter } from "@/lib/response-formatter";
import { NextRequest } from "next/server";
import { minioService } from "../minio/minio.service";
import { validateSchema } from "@/lib/validation";
import { CSVUploadedSchema, TCSVUploaded } from "@/schemas/file.schema";
import { handleException } from "@/common/exception/helper";

export const uploadFileController = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    const { data } = validateSchema<TCSVUploaded>(CSVUploadedSchema, { file });
    const { file: validatedFile } = data;

    const buffer = Buffer.from(await validatedFile.arrayBuffer());
    const objectName = `${Date.now()}-${validatedFile.name.replace(/\s+/g, "_")}`;

    await minioService.uploadFile({
      bucketName: process.env.MINIO_BUCKET_NAME!,
      objectName,
      file: buffer,
      metadata: {
        "Content-Type": validatedFile.type,
      },
    });

    return responseFormatter.success({
      message: "File uploaded successfully",
    });
  } catch (error) {
    return handleException(error);
  }
};
