import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { TIndexSimulationQueryParams } from "@/schemas/simulation.schema";
import { useQuery } from "@tanstack/react-query";
import { multiStepSimulationCreationQueries } from "../_api/queries";
import { TSimulationJobFileValidationStatusEnum } from "@/types/database";

export const useGetSimulationUploadedRowsQuery = (
  queryParams: TIndexSimulationQueryParams,
  fileValidationStatus?: TSimulationJobFileValidationStatusEnum,
  id?: string,
) => {
  const api = useAuthenticatedClient();

  return useQuery(
    multiStepSimulationCreationQueries.getSimulationUploadedRows(
      api,
      queryParams,
      fileValidationStatus,
      id,
    ),
  );
};
