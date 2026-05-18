import z from "zod";

export const BulkErrorRowsSchema = z.object({
  rowIds: z.array(z.number()).min(1, "At least one row ID must be provided"),
});

export type TBulkErrorRowsSchema = z.infer<typeof BulkErrorRowsSchema>;
