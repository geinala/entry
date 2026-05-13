import useAuthenticatedClient from "@/app/_hooks/use-authenticated-client";
import { useQuery } from "@tanstack/react-query";
import { multiStepSimulationCreationQueries } from "../_api/queries";
import { TSimulationJobUploadedRowsIndexQueryParams } from "@/schemas/simulations/jobs/simulation-job-index-query-params";

interface IUseGetSimulationUploadedRowsQuery {
  queryParams: TSimulationJobUploadedRowsIndexQueryParams;
  id?: string;
  shouldRefetch?: boolean;
}

export const useGetAllNeedReviewSimulationUploadedRows = ({
  queryParams,
  id,
  shouldRefetch,
}: IUseGetSimulationUploadedRowsQuery) => {
  const api = useAuthenticatedClient();

  return useQuery(
    multiStepSimulationCreationQueries.getAllNeedReviewSimulationUploadedRows({
      api,
      queryParams,
      id,
      shouldRefetch,
    }),
  );
};
