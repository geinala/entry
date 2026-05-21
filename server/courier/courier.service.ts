import { TCourier } from "@/types/database";
import { getAllCouriersRepository } from "./courier.repository";

export const getAllCouriersService = async (simulationId: string): Promise<TCourier[]> => {
  return await getAllCouriersRepository(simulationId);
};
