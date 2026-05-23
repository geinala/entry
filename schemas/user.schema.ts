import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const UserIndexQueryParams = IndexQueryParams.extend({
  sort: createSortSchema(["fullName", "email"]),
});

export type TUserIndexQueryParams = z.infer<typeof UserIndexQueryParams>;
