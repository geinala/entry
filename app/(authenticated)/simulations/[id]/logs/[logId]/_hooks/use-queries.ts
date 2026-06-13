import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { SIMULATION_LOG_QUERIES } from "../_api/queries";
import { useQuery } from "@tanstack/react-query";

export const useGetSimulationLogByIdQuery = (simulationId: string, logId: string) => {
  const api = useAuthenticatedClient();

  return useQuery(
    SIMULATION_LOG_QUERIES.getSimulationLogById({
      api,
      simulationId,
      logId,
    }),
  );
};
