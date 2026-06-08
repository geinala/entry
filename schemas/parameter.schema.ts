import { tuningExperimentDatasetStatusEnum } from "@/drizzle/schema";
import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";
import { csvFileSchema } from "./file.schema";

export const IndexParameterQueryParams = IndexQueryParams.extend({
  sort: createSortSchema(["createdAt"]),
  status: z.enum(tuningExperimentDatasetStatusEnum.enumValues).optional(),
});

export type TIndexParameterQueryParams = z.infer<typeof IndexParameterQueryParams>;

export const CreateParameterSchema = z.object({
  dataset: csvFileSchema,
});

export type TCreateParameterSchema = z.infer<typeof CreateParameterSchema>;
