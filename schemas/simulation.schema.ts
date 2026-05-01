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
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

export type TCreateSimulationSchema = z.infer<typeof CreateSimulationSchema>;

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

export const VehicleIdParamWithSimulationIdParamSchema = SimulationIdParamSchema.extend({
  vehicleId: z.coerce.number().int("Invalid vehicle ID format").positive().optional(),
});

export type TVehicleIdParamWithSimulationIdParamSchema = z.infer<
  typeof VehicleIdParamWithSimulationIdParamSchema
>;
export type TCreateSimulationConstraintsSchema = z.infer<typeof CreateSimulationConstraintsSchema>;
