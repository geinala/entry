import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { multiStepSimulationCreationQueries } from "../_api/queries";
import { TSimulationJobFileValidationStatusEnum } from "@/types/database";
import { TSimulationJobFilesIndexQueryParams } from "@/schemas/simulations/jobs/simulation-job-index-query-params";

export const useGetSimulationUploadedRowsQuery = (
  queryParams: TSimulationJobFilesIndexQueryParams,
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

export const useGetSimulationAddressErrors = (
  queryParams: TSimulationJobFilesIndexQueryParams,
  id?: string,
) => {
  const api = useAuthenticatedClient();

  return useQuery(
    multiStepSimulationCreationQueries.getSimulationAddressErrors(api, queryParams, id),
  );
};
