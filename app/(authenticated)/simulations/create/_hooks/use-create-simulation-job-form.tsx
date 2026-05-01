import {
  CreateSimulationJobSchema,
  TCreateSimulationJobSchema,
} from "@/schemas/simulations/create-simulation.schema";
import { useForm } from "@tanstack/react-form";

interface Params {
  defaultValue: TCreateSimulationJobSchema;
  onSubmit?: (values: TCreateSimulationJobSchema) => Promise<void>;
}

export const useCreateSimulationJobForm = ({ defaultValue, onSubmit }: Params) => {
  return useForm({
    defaultValues: defaultValue,
    validators: {
      onSubmit: CreateSimulationJobSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value);
    },
  });
};
