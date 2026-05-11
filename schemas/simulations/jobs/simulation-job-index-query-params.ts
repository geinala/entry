import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const SimulationJobFilesIndexQueryParams = IndexQueryParams.extend({
  onlyErrors: z
    .string()
    .transform((value) => value === "true")
    .default("false"),
  onlyAddressErrors: z
    .string()
    .transform((value) => value === "true")
    .default("false"),
});

export type TSimulationJobFilesIndexQueryParams = z.infer<
  typeof SimulationJobFilesIndexQueryParams
>;
