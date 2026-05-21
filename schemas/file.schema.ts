import z from "zod";

const ALLOWED_MIME_TYPES = ["application/csv", "text/csv"];
const MAX_CSV_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const isCsvFile = (file: File) => {
  return ALLOWED_MIME_TYPES.includes(file.type) || file.name.toLowerCase().endsWith(".csv");
};

export const csvFileSchema = z
  .instanceof(File, { message: "File is required" })
  .refine(isCsvFile, {
    message: "Invalid file type. Only CSV files are allowed.",
  })
  .refine((file) => file.size <= MAX_CSV_FILE_SIZE, { message: "File size exceeds 10MB limit." });

export const GetPresignedUrlParamsSchema = z.object({
  objectName: z.string().nonempty("Object name is required"),
  forceDownload: z.boolean().optional(),
});

export type TGetPresignedUrlParams = z.infer<typeof GetPresignedUrlParamsSchema>;
