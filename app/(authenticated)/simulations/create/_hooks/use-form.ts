import {
  CreateSimulationJobSchema,
  TCreateSimulationJobSchema,
} from "@/schemas/simulations/create-simulation.schema";
import { useForm } from "@tanstack/react-form";
import { formatDate } from "date-fns";

export type UseCreateSimulationFormReturn = ReturnType<typeof useCreateSimulationForm>;

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
      algorithm: "google_or_tools",
      congestionDelayThresholdInSeconds: 300,
      diversificationStrength: 30,
      diversifyAfterIterations: 75,
      earlyStopNoImprovementIterations: 150,
      enableAspiration: true,
      enableResequence: true,
      maxNeighbors2Opt: 25,
      randomSeed: 42,
      resequenceImprovementThresholdPercent: 3,
      tabuIterations: 300,
      tabuTenure: 15,
    },
    validators: {
      onSubmit: CreateSimulationJobSchema,
    },
    onSubmit: async ({ value }: { value: TCreateSimulationJobSchema }) => {
      await onSubmit(value);
    },
  });
};
