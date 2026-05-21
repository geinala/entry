import { simulationStatusEnum } from "@/drizzle/schema";
import { createSortSchema } from "@/lib/validation";
import { IndexQueryParams } from "@/types/query-params";
import z from "zod";

export const SimulationIdParamSchema = z.object({
  simulationId: z.string().uuid("Invalid simulation ID format"),
});

export const IndexSimulationQueryParams = IndexQueryParams.extend({
  sort: createSortSchema(["createdAt", "title"]),
  status: z.enum(simulationStatusEnum.enumValues).optional(),
});

export type TIndexSimulationQueryParams = z.infer<typeof IndexSimulationQueryParams>;

export const CreateSimulationConstraintsSchema = z.object({
  vehiclesConstraints: z.array(
    z.object({
      vehicleName: z
        .string()
        .trim()
        .nonempty("Vehicle name is required")
        .max(100, "Vehicle name must be less than 100 characters"),
      maxCapacity: z.number().max(50, "Max capacity must be less than 50 kg"),
    }),
  ),
  computationTimeLimit: z
    .number()
    .min(300, "Computation time limit must be at least 5 minutes (300 seconds)")
    .max(600, "Computation time limit must be less than 10 minutes (600 seconds)"),
});

export const CourierIdParamWithSimulationIdParamSchema = SimulationIdParamSchema.extend({
  courierId: z.coerce.number().int("Invalid courier ID format").positive().optional(),
});

export type TCourierIdParamWithSimulationIdParamSchema = z.infer<
  typeof CourierIdParamWithSimulationIdParamSchema
>;
export type TCreateSimulationConstraintsSchema = z.infer<typeof CreateSimulationConstraintsSchema>;
