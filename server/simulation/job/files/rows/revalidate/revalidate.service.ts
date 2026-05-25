import { InternalServerErrorException } from "@/common/exception/internal_server_error.exception";
import { server } from "@/lib/axios";
import { updateSimulationJobRepository } from "../../../job.repository";

export const revalidateAddressRowService = async (jobId: string) => {
  try {
    await Promise.all([
      updateSimulationJobRepository(jobId, { geocodingStatus: "in_progress" }),
      server.post(`/simulations/jobs/${jobId}/revalidate`),
    ]);
  } catch {
    throw new InternalServerErrorException("Failed to revalidate address row");
  }
};
