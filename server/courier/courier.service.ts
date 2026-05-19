import { TCourier } from "@/types/database";
import { getAllActiveCouriersRepository } from "./courier.repository";

export const getAllActiveCouriersService = async (simulationId: string): Promise<TCourier[]> => {
  return await getAllActiveCouriersRepository(simulationId);
};
