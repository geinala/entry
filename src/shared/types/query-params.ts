import z from "zod";

export interface IPaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export const BaseQueryParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
});

export type TBaseQueryParams = z.infer<typeof BaseQueryParamsSchema>;
