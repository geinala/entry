import { InternalServerErrorException } from "@/common/exception/internal_server_error.exception";
import { server } from "@/lib/axios";

export const revalidateAddressRowService = async (jobId: string) => {
  try {
    await server.post(`/simulations/jobs/${jobId}/revalidate`);
  } catch {
    throw new InternalServerErrorException("Failed to revalidate address row");
  }
};
