import "server-only";

import { minioClient } from "@/lib/minio";
import Stream from "node:stream";
import { ItemBucketMetadata } from "minio";

interface IUploadFileParams {
  bucketName: string;
  objectName: string;
  file: Stream.Readable | Buffer | string;
  size?: number;
  metadata?: ItemBucketMetadata;
}

type UploadedObjectInfo = ReturnType<typeof minioClient.putObject>;

export const minioService = {
  async uploadFile({
    bucketName,
    objectName,
    file,
    metadata,
  }: IUploadFileParams): Promise<UploadedObjectInfo> {
    return await minioClient.putObject(bucketName, objectName, file, undefined, metadata);
  },

  async getFile(bucketName: string, objectName: string): Promise<Stream.Readable> {
    return await minioClient.getObject(bucketName, objectName);
  },

  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    await minioClient.removeObject(bucketName, objectName);
  },
};
