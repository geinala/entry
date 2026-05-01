import { getLatestRouteBySimulationIdRepository } from "./route.repository";

export const getLatestRouteBySimulationIdService = async (
  simulationId: string,
  vehicleId?: number,
) => {
  return getLatestRouteBySimulationIdRepository(simulationId, vehicleId);
};
