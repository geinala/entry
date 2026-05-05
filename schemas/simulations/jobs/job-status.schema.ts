import { simulationJobStatusEnum } from "@/drizzle/schema";
import z from "zod";

export const SimulationJobStatusSchema = z.object({
  status: z.enum(simulationJobStatusEnum.enumValues).optional(),
  excludeStatus: z.array(z.enum(simulationJobStatusEnum.enumValues)).optional(),
});

export type TSimulationJobStatusSchema = z.infer<typeof SimulationJobStatusSchema>;
