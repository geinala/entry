import { simulationJobFileValidationStatusEnum } from "@/drizzle/schema";
import z from "zod";

export const UpdateSimulationJobSchema = z.object({
  nextStep: z
    .number({
      required_error: "Next step is required",
      message: "Next step must be a number",
    })
    .int()
    .positive("Next step must be a positive integer"),
  fileValidationStatus: z.enum(simulationJobFileValidationStatusEnum.enumValues).optional(),
});

export type TUpdateSimulationJobSchema = z.infer<typeof UpdateSimulationJobSchema>;
