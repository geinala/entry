import { getLatestRouteBySimulationIdRepository } from "./route.repository";

export const getLatestRouteBySimulationIdService = async (simulationId: string) => {
  return getLatestRouteBySimulationIdRepository(simulationId);
};
