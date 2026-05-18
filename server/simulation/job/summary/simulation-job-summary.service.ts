import "server-only";

import { TSimulationJobSummary } from "@/types/database";
import {
  getSimulationJobAreaDistributionRepository,
  getSimulationJobDatasetSummaryRepository,
  getSimulationJobGeocodingSummaryRepository,
  getSimulationJobSummaryBaseRepository,
} from "./simulation-job-summary.repository";

const deriveDepotName = (address: string) => {
  const segments = address
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length >= 2) {
    return segments.slice(0, 2).join(", ");
  }

  return address.trim();
};

export const getSimulationJobSummaryService = async (
  userId: string,
  jobId: string,
): Promise<TSimulationJobSummary | null> => {
  const job = await getSimulationJobSummaryBaseRepository(userId, jobId);

  if (!job) {
    return null;
  }

  const [datasetSummary, geocodingSummary, areaDistribution] = await Promise.all([
    getSimulationJobDatasetSummaryRepository(jobId),
    getSimulationJobGeocodingSummaryRepository(jobId),
    getSimulationJobAreaDistributionRepository(jobId),
  ]);

  const totalOrders = job.fileTotalRows ?? datasetSummary.validOrders;

  return {
    datasetSummary: {
      totalOrders: totalOrders,
      validOrders: datasetSummary.validOrders,
      ignoredOrders: datasetSummary.ignoredOrders,
      courierCount: datasetSummary.courierCount,
      depotName: deriveDepotName(job.depotLocationAddress),
      estimatedTotalWeightKg: datasetSummary.estimatedTotalWeightKg,
    },
    geocodingSummary: {
      autoResolved: geocodingSummary.autoResolved,
      manuallyCorrected: geocodingSummary.manuallyCorrected,
      ignored: geocodingSummary.ignored,
    },
    areaDistribution: areaDistribution.map((item) => ({
      areaName: item.areaName,
      totalOrders: item.totalOrders,
    })),
  };
};
