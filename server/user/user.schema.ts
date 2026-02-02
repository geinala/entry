import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const GetUsersQueryParams = IndexQueryParams.extend({
  sort: createSortSchema(["fullName", "email"]),
});

export type GetUsersQueryParamsType = z.infer<typeof GetUsersQueryParams>;
