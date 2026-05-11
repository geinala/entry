import { simulationJobFileValidationStatusEnum } from "@/drizzle/schema";
import z from "zod";

export const UpdateSimulationJobSchema = z.object({
  currentStep: z.number().int().nonnegative(),
  fileValidationStatus: z.enum(simulationJobFileValidationStatusEnum.enumValues).optional(),
  validationCompletedAt: z.string().optional(), // ISO string representation of the date
});

export type TUpdateSimulationJobSchema = z.infer<typeof UpdateSimulationJobSchema>;
