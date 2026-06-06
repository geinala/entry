import z from "zod";

export const OptimizationSummarySchema = z.object({
  courierId: z.coerce.number().optional(),
  summaryType: z.enum(["initial", "final"]).default("initial"),
});

export type TOptimizationSummaryParams = z.infer<typeof OptimizationSummarySchema>;
