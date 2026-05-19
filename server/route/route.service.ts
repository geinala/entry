import { getLatestRouteBySimulationIdRepository } from "./route.repository";

export const getLatestRouteBySimulationIdService = async (
  simulationId: string,
  courierId?: number,
) => {
  return getLatestRouteBySimulationIdRepository(simulationId, courierId);
};
