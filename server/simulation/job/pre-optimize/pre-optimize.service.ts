import {
  TNewCourier,
  TNewNode,
  TNewNodeDetail,
  TSimulationJobSummary,
  TSimulationUploadedRow,
} from "@/types/database";
import {
  getAllUploadedRowsRepository,
  insertAllCouriersFromUploadedRowsRepository,
  createSimulationFromJobRepository,
  insertAllNodeDetailsFromUploadedRowsRepository,
  insertAllNodesFromUploadedRowsRepository,
  getSimulationJobCombinedSummaryRepository,
  getSimulationJobAreaDistributionRepository,
  getSimulationJobSummaryBaseRepository,
} from "./pre-optimize.repository";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const deriveDepotName = (address: string): string => {
  const segments = address
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return segments.length >= 2 ? segments.slice(0, 2).join(", ") : address.trim();
};

const toNumber = (value: unknown, fallback = 0): number =>
  typeof value === "number" ? value : fallback;

type AddressEntry = {
  matrixIndex: number;
  latitude: number | null;
  longitude: number | null;
  demand: number;
  details: { name: string; address: string; city: string; weight: number }[];
};

const buildAddressMap = (rows: TSimulationUploadedRow[]): Map<string, AddressEntry> => {
  const map = new Map<string, AddressEntry>();

  for (const row of rows) {
    const address = (
      row.finalAddress ??
      row.suggestedAddress ??
      row.normalizedAddress ??
      row.address ??
      ""
    )
      .toString()
      .trim();

    if (!address) continue;

    const key = `${address}|||${row.latitude ?? ""}|||${row.longitude ?? ""}`;
    const weight = toNumber(row.weight);
    const detail = {
      name: row.customerName ?? "",
      address,
      city: row.city ?? "",
      weight,
    };

    const entry = map.get(key);
    if (entry) {
      entry.demand += weight;
      entry.details.push(detail);
    } else {
      map.set(key, {
        matrixIndex: map.size, // replaces the manual `idx` counter
        latitude: typeof row.latitude === "number" ? row.latitude : null,
        longitude: typeof row.longitude === "number" ? row.longitude : null,
        demand: weight,
        details: [detail],
      });
    }
  }

  return map;
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const preOptimizeService = async (
  userId: string,
  jobId: string,
): Promise<TSimulationJobSummary | null> => {
  // Fail fast — validate the job belongs to this user before doing any work.
  const job = await getSimulationJobSummaryBaseRepository(userId, jobId);
  if (!job) return null;

  const uploadedRows = (await getAllUploadedRowsRepository(jobId)) as TSimulationUploadedRow[];

  const createdSimulation = await createSimulationFromJobRepository(jobId);
  if (!createdSimulation) throw new Error("Simulation job not found");
  const simulationId = createdSimulation.id as string;

  const courierNames = new Set(
    uploadedRows.map((r) => r.courier?.toString().trim()).filter(Boolean) as string[],
  );

  const couriers: TNewCourier[] = Array.from(courierNames).map((name) => ({
    simulationId,
    name,
    isActive: true,
  }));

  const addressMap = buildAddressMap(uploadedRows);
  const entries = Array.from(addressMap.values());

  const nodes: TNewNode[] = entries.map((v) => ({
    simulationId,
    matrixIndex: v.matrixIndex,
    latitude: v.latitude ?? 0,
    longitude: v.longitude ?? 0,
    demand: v.demand,
  }));

  // ── Persist in parallel where there are no dependencies ───────────────────
  const [, insertedNodeRows] = await Promise.all([
    couriers.length ? insertAllCouriersFromUploadedRowsRepository(couriers) : Promise.resolve(),
    nodes.length ? insertAllNodesFromUploadedRowsRepository(nodes) : Promise.resolve([]),
  ]);

  if (insertedNodeRows?.length) {
    const indexToNodeId = new Map<number, number>(
      (insertedNodeRows as { id: number; matrixIndex: number }[]).map((n) => [n.matrixIndex, n.id]),
    );

    const nodeDetails: TNewNodeDetail[] = entries.flatMap((v) =>
      v.details.map((d) => ({
        nodeId: indexToNodeId.get(v.matrixIndex)!,
        name: d.name,
        address: d.address,
        city: d.city,
        weight: d.weight,
      })),
    );

    if (nodeDetails.length) {
      await insertAllNodeDetailsFromUploadedRowsRepository(nodeDetails);
    }
  }

  // ── Summary queries — two queries instead of three ────────────────────────
  const [combinedSummary, areaDistribution] = await Promise.all([
    getSimulationJobCombinedSummaryRepository(jobId),
    getSimulationJobAreaDistributionRepository(jobId),
  ]);

  return {
    datasetSummary: {
      totalOrders: job.fileTotalRows ?? combinedSummary.validOrders,
      validOrders: combinedSummary.validOrders,
      ignoredOrders: combinedSummary.ignoredOrders,
      courierCount: combinedSummary.courierCount,
      depotName: deriveDepotName(job.depotLocationAddress),
      estimatedTotalWeightKg: combinedSummary.estimatedTotalWeightKg,
    },
    geocodingSummary: {
      autoResolved: combinedSummary.autoResolved,
      manuallyCorrected: combinedSummary.manuallyCorrected,
      ignored: combinedSummary.ignored,
    },
    areaDistribution: areaDistribution.map(({ areaName, totalOrders }) => ({
      areaName,
      totalOrders,
    })),
  };
};
