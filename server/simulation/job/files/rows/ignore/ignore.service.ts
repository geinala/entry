import {
  ignoreAllErrorAddressRowsAndContinueRepository,
  ignoreErrorAddressRowByIdRepository,
} from "./ignore.repository";

export const ignoreAllErrorAddressRowsAndContinueService = async (simulationJobId: string) => {
  return await ignoreAllErrorAddressRowsAndContinueRepository(simulationJobId);
};

export const ignoreErrorAddressRowByIdService = async (jobId: string, rowId: number) => {
  return await ignoreErrorAddressRowByIdRepository(jobId, rowId);
};
