"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { simulationDetailQueries } from "../_api/queries";
import { TCourier } from "@/types/database";

export const useGetAllCouriersQuery = (
  simulationId?: string,
  onSuccess?: (data: TCourier[]) => void,
) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationDetailQueries.getAllCouriers(api, simulationId, onSuccess));
};

export const useGetFinalRoutesQuery = (simulationId?: string, courierId?: number) => {
  const api = useAuthenticatedClient();

  return useQuery(simulationDetailQueries.getFinalRoutes(api, simulationId, courierId));
};
