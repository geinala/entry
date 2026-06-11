import {
  CreateSimulationJobSchema,
  TCreateSimulationJobSchema,
} from "@/schemas/simulations/create-simulation.schema";
import { useForm } from "@tanstack/react-form";
import { formatDate } from "date-fns";

interface UseCreateSimulationFormParams {
  onSubmit: (data: TCreateSimulationJobSchema) => Promise<void>;
}

export const useCreateSimulationForm = ({ onSubmit }: UseCreateSimulationFormParams) => {
  return useForm({
    defaultValues: {
      computationTimeLimit: 600,
      customersFile: null as unknown as File,
      depotLatitude: 0,
      depotLongitude: 0,
      depotLocationAddress: "",
      startDatetime: new Date().toISOString(),
      title: "Simulation Job - " + formatDate(new Date(), "yyyy-MM-dd"),
      depotId: 0,
      algorithm: "manual_without_optimization",
      congestionDelayThresholdInSeconds: 300,
      resequenceImprovementThresholdPercent: 3,
    },
    validators: {
      onSubmit: CreateSimulationJobSchema,
    },
    onSubmit: async ({ value }: { value: TCreateSimulationJobSchema }) => {
      await onSubmit(value);
    },
  });
};
