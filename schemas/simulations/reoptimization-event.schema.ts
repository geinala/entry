import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const ReoptimizationEventTableIndexQueryParams = IndexQueryParams.extend({
  courierId: z.coerce.number().optional(),
});

export type TReoptimizationEventTableIndexQueryParams = z.infer<
  typeof ReoptimizationEventTableIndexQueryParams
>;
