"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { simulationDetailQueries } from "../_api/queries";

export const useGetAllActiveCouriersQuery = (simulationId?: string) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationDetailQueries.getAllActiveCouriers(api, simulationId));
};

export const useGetFinalRoutesQuery = (simulationId?: string, vehicleId?: number) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationDetailQueries.getFinalRoutes(api, simulationId, vehicleId));
};
