import { simulationStatusEnum } from "@/drizzle/schema";
import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const SimulationIdParamSchema = z.object({
  simulationId: z.string().uuid("Invalid simulation ID format"),
});

export const CreateSimulationSchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty("Title is required")
    .max(300, "Title must be less than 300 characters"),
});

export type TCreateSimulationSchema = z.infer<typeof CreateSimulationSchema>;

export const IndexSimulationQueryParams = IndexQueryParams.extend({
  sort: createSortSchema(["createdAt", "title"]),
  status: z.enum(simulationStatusEnum.enumValues).optional(),
});

export type TIndexSimulationQueryParams = z.infer<typeof IndexSimulationQueryParams>;
