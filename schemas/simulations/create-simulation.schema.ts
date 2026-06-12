import z from "zod";
import { csvFileSchema } from "../file.schema";

export const CreateSimulationJobSchema = z.object({
  title: z
    .string({
      required_error: "Please provide a title for this simulation.",
      invalid_type_error: "The title must be text.",
    })
    .trim()
    .nonempty("The title cannot be left blank.")
    .max(300, "The title is too long. Please keep it under 300 characters."),
  depotLatitude: z.coerce
    .number({
      required_error: "Please specify the depot's latitude.",
      invalid_type_error: "Latitude must be a valid number.",
    })
    .min(-90, "Latitude must be a valid coordinate between -90 and 90.")
    .max(90, "Latitude must be a valid coordinate between -90 and 90."),
  depotLongitude: z.coerce
    .number({
      required_error: "Please specify the depot's longitude.",
      invalid_type_error: "Longitude must be a valid number.",
    })
    .min(-180, "Longitude must be a valid coordinate between -180 and 180.")
    .max(180, "Longitude must be a valid coordinate between -180 and 180."),
  depotLocationAddress: z
    .string({
      required_error: "Please provide the depot's address.",
      invalid_type_error: "The depot address must be text.",
    })
    .trim()
    .nonempty("The depot address cannot be left blank.")
    .max(500, "The address is too long. Please keep it under 500 characters."),
  startDatetime: z
    .string({
      required_error: "Please specify a starting date and time.",
      invalid_type_error: "The start date and time must be text.",
    })
    .refine((value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }, "Invalid date format. Please check and try again."),
  depotId: z.number({
    required_error: "Please select a depot.",
    invalid_type_error: "Invalid depot ID (must be a number).",
  }),
  customersFile: csvFileSchema,
  resequenceImprovementThresholdPercent: z
    .number({
      required_error: "Please set an improvement threshold for resequencing.",
      invalid_type_error: "The improvement threshold must be a number.",
    })
    .min(0, "The improvement percentage cannot be less than 0%.")
    .max(100, "The improvement percentage cannot exceed 100%."),
  congestionDelayThresholdInSeconds: z
    .number({
      required_error: "Please set a congestion delay threshold.",
      invalid_type_error: "Congestion delay threshold must be a number.",
    })
    .min(0, "Congestion delay cannot be a negative number.")
    .max(3600, "Congestion delay is too high. It cannot exceed 1 hour (3600 seconds)."),
  isWithAdaptiveParameters: z.boolean({
    required_error: "Please specify whether to use adaptive parameters.",
    invalid_type_error: "The value for adaptive parameters must be true or false.",
  }),
});

export type TCreateSimulationJobSchema = z.infer<typeof CreateSimulationJobSchema>;
