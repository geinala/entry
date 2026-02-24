import z from "zod";

const ALLOWED_MIME_TYPES = ["application/csv", "text/csv"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const CSVUploadedSchema = z.object({
  file: z
    .instanceof(File, { message: "File is required" })
    .refine((file) => ALLOWED_MIME_TYPES.includes(file.type), {
      message: "Invalid file type. Only CSV files are allowed.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: "File size exceeds 10MB limit." }),
});

export type TCSVUploaded = z.infer<typeof CSVUploadedSchema>;
