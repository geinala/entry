"use client";

import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { simulationDetailQueries } from "../_api/queries";

export const useGetFileWithSimulationIdQuery = (simulationId: string, hasUploadedCSV: boolean) => {
  const api = useAuthenticatedClient();

  return useQuery(
    simulationDetailQueries.findFileWithSimulationId(api, simulationId, hasUploadedCSV),
  );
};
