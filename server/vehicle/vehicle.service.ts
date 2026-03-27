import { TVehicle } from "@/types/database";
import { getAllActiveVehiclesRepository } from "./vehicle.repository";

export const getAllActiveVehiclesService = async (simulationId: string): Promise<TVehicle[]> => {
  return await getAllActiveVehiclesRepository(simulationId);
};
