import z from "zod";

export const IndexQueryParams = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  orderBy: z.string().optional(),
  orderDirection: z.enum(["asc", "desc"]).default("asc").optional(),
});

export type IndexQueryParamsType = z.infer<typeof IndexQueryParams>;
