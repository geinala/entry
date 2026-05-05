import z from "zod";

const requiredString = (label: string) =>
  z
    .string({
      required_error: `${label} is required`,
      message: `${label} must be a string`,
    })
    .trim()
    .nonempty(`${label} cannot be empty`);

export const UpdateSimulationUploadedRowSchema = z
  .object({
    nosi: requiredString("No SI"),
    courier: requiredString("Courier"),
    customerName: requiredString("Customer name"),
    address: requiredString("Address"),
    city: requiredString("City"),
    weight: z.coerce
      .number({
        required_error: "Weight is required",
        message: "Weight must be a number",
      })
      .positive("Weight must be greater than 0"),
    startDatetime: z
      .string({
        required_error: "Start datetime is required",
        message: "Start datetime must be a string",
      })
      .refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid start datetime"),
    endDatetime: z
      .string({
        required_error: "End datetime is required",
        message: "End datetime must be a string",
      })
      .refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid end datetime"),
  })
  .refine(
    (value) => new Date(value.endDatetime).getTime() >= new Date(value.startDatetime).getTime(),
    {
      message: "End datetime must be greater than or equal to start datetime",
      path: ["endDatetime"],
    },
  );

export type TUpdateSimulationUploadedRowSchema = z.infer<
  typeof UpdateSimulationUploadedRowSchema
>;
