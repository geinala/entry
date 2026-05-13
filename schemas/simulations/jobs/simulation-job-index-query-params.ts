import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const SimulationJobUploadedRowsIndexQueryParams = IndexQueryParams.extend({
  currentStep: z.number().optional(),
});

export type TSimulationJobUploadedRowsIndexQueryParams = z.infer<
  typeof SimulationJobUploadedRowsIndexQueryParams
>;
