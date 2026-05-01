import "server-only";
import {
  deleteDraftSimulationJobRepository,
  getDraftSimulationJobRepository,
} from "./simulation-job-draft.repository";

export const deleteDraftSimulationJobService = async (userId: string) => {
  return await deleteDraftSimulationJobRepository(userId);
};

export const getDraftSimulationJobService = async (userId: string) => {
  return await getDraftSimulationJobRepository(userId);
};
