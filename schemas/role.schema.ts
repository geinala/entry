import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const IndexRoleQueryParams = IndexQueryParams.extend({
  sort: createSortSchema(["name"]),
});

export type TIndexRoleQueryParams = z.infer<typeof IndexRoleQueryParams>;
