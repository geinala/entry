import z from "zod";

export const DeleteErrorRowsSchema = z.object({
  rowIds: z.array(z.number()).min(1, "At least one row ID must be provided"),
});

export type TDeleteErrorRowsSchema = z.infer<typeof DeleteErrorRowsSchema>;
