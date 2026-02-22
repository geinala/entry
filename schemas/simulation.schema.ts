import z from "zod";

export const CreateSimulationSchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty("Title is required")
    .max(300, "Title must be less than 300 characters"),
});

export type TCreateSimulationSchema = z.infer<typeof CreateSimulationSchema>;
