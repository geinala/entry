import z from "zod";

export const CreateOrUpdateDepotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().refine((value) => value >= -90 && value <= 90, {
    message: "Latitude must be between -90 and 90",
  }),
  longitude: z.number().refine((value) => value >= -180 && value <= 180, {
    message: "Longitude must be between -180 and 180",
  }),
});

export const DepotIdParamSchema = z.object({
  depotId: z.coerce.number().int().positive(),
});

export type TCreateOrUpdateDepotSchema = z.infer<typeof CreateOrUpdateDepotSchema>;
export type TDepotIdParamSchema = z.infer<typeof DepotIdParamSchema>;
