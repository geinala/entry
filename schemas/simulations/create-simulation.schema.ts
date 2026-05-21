import z from "zod";
import { csvFileSchema } from "../file.schema";

export const CreateSimulationJobSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .nonempty("Title cannot be empty")
    .max(300, "Title must be less than 300 characters"),
  depotLatitude: z.coerce
    .number({
      required_error: "Depot latitude is required",
      message: "Depot latitude must be a number",
    })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  depotLongitude: z.coerce
    .number({
      required_error: "Depot longitude is required",
      message: "Depot longitude must be a number",
    })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
  depotLocationAddress: z
    .string({
      required_error: "Depot location address is required",
      message: "Depot location address must be a string",
    })
    .trim()
    .nonempty("Depot location address cannot be empty")
    .max(500, "Depot location address must be less than 500 characters"),
  computationTimeLimit: z.coerce
    .number({
      required_error: "Computation time limit is required",
      message: "Computation time limit must be a number",
    })
    .min(300, "Computation time limit must be at least 5 minutes (300 seconds)")
    .max(600, "Computation time limit must be less than 10 minutes (600 seconds)"),
  startDatetime: z
    .string({
      required_error: "Start datetime is required",
      message: "Start datetime must be a string",
    })
    .refine((value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }, "Invalid date format"),
  depotId: z.number({
    required_error: "Depot ID is required",
    message: "Depot ID must be a number",
  }),
  customersFile: csvFileSchema,
});

export type TCreateSimulationJobSchema = z.infer<typeof CreateSimulationJobSchema>;
