import env from "@/common/config/environtment";
import { minioService } from "../minio/minio.service";

export const uploadFileService = async (file: File, path: string) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const objectName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  const objectPath = `${path}/${objectName}`;

  const result = await minioService.uploadFile({
    bucketName: process.env.MINIO_BUCKET_NAME!,
    objectName: objectPath,
    size: buffer.length,
    file: buffer,
    metadata: {
      "Content-Type": file.type,
    },
  });

  return {
    fileName: objectName,
    filePath: objectPath,
    etag: result.etag,
    versionId: result.versionId ?? null,
  };
};

export const getPresignedUrlService = async (
  objectPath: string,
  expiresInSeconds: number,
  download: boolean = false,
) => {
  return await minioService.presignedUrl(
    env.MINIO_BUCKET_NAME,
    objectPath,
    expiresInSeconds,
    download,
  );
};
