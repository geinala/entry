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
      customersFile: null as unknown as File,
      depotLatitude: 0,
      depotLongitude: 0,
      depotLocationAddress: "",
      startDatetime: new Date().toISOString(),
      title: "Simulation Job - " + formatDate(new Date(), "yyyy-MM-dd"),
      depotId: 0,
      congestionDelayThresholdInSeconds: 300,
      resequenceImprovementThresholdPercent: 3,
      isWithAdaptiveParameters: true,
    },
    validators: {
      onSubmit: CreateSimulationJobSchema,
    },
    onSubmit: async ({ value }: { value: TCreateSimulationJobSchema }) => {
      await onSubmit(value);
    },
  });
};
