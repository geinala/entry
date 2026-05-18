import "server-only";

import {
  TSimulationJobAreaDistributionRow,
  TSimulationJobDatasetSummaryRow,
  TSimulationJobGeocodingSummaryRow,
  TSimulationJobSummaryBaseRow,
} from "@/types/database";
import { simulationJobTable, simulationUploadedRows } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { and, eq, sql } from "drizzle-orm";

export type { TSimulationJobAreaDistributionRow };

export const getSimulationJobSummaryBaseRepository = async (
  userId: string,
  jobId: string,
): Promise<TSimulationJobSummaryBaseRow | null> => {
  const [job] = await db
    .select({
      id: simulationJobTable.id,
      depotLocationAddress: simulationJobTable.depotLocationAddress,
      fileTotalRows: simulationJobTable.fileTotalRows,
    })
    .from(simulationJobTable)
    .where(and(eq(simulationJobTable.id, jobId), eq(simulationJobTable.userId, userId)))
    .limit(1);

  return (job ?? null) as TSimulationJobSummaryBaseRow | null;
};

export const getSimulationJobDatasetSummaryRepository = async (
  jobId: string,
): Promise<TSimulationJobDatasetSummaryRow> => {
  const result: { rows: TSimulationJobDatasetSummaryRow[] } =
    await db.execute(sql<TSimulationJobDatasetSummaryRow>`
    select
      count(*) filter (where deleted_at is null) :: int as "validOrders",
      count(*) filter (where deleted_at is null and is_ignored = true) :: int as "ignoredOrders",
      count(distinct nullif(trim(courier), '')) filter (
        where deleted_at is null and is_ignored = false
      ) :: int as "courierCount",
      coalesce(sum(weight) filter (where deleted_at is null and is_ignored = false), 0) :: float8
        as "estimatedTotalWeightKg"
    from ${simulationUploadedRows}
    where ${simulationUploadedRows.simulationJobId} = ${jobId}
  `);
  const summary = result.rows[0];

  return {
    courierCount: summary.courierCount,
    estimatedTotalWeightKg: summary.estimatedTotalWeightKg,
    ignoredOrders: summary.ignoredOrders,
    validOrders: summary.validOrders,
  };
};

export const getSimulationJobGeocodingSummaryRepository = async (
  jobId: string,
): Promise<TSimulationJobGeocodingSummaryRow> => {
  const result: { rows: TSimulationJobGeocodingSummaryRow[] } =
    await db.execute(sql<TSimulationJobGeocodingSummaryRow>`
    select
      count(*) filter (
        where deleted_at is null
          and is_ignored = false
          and resolution_status = 'auto_solved'
      ) :: int as "autoResolved",
      count(*) filter (
        where deleted_at is null
          and is_ignored = false
          and resolution_status = 'manual_override'
      ) :: int as "manuallyCorrected",
      count(*) filter (where deleted_at is null and is_ignored = true) :: int as "ignored"
    from ${simulationUploadedRows}
    where ${simulationUploadedRows.simulationJobId} = ${jobId}
  `);
  const summary = result.rows[0];

  return (
    summary ?? {
      autoResolved: 0,
      manuallyCorrected: 0,
      ignored: 0,
    }
  );
};

export const getSimulationJobAreaDistributionRepository = async (
  jobId: string,
): Promise<TSimulationJobAreaDistributionRow[]> => {
  const result: { rows: TSimulationJobAreaDistributionRow[] } =
    await db.execute(sql<TSimulationJobAreaDistributionRow>`
    with normalized_areas as (
      select
        initcap(lower(nullif(btrim(split_part(city, ',', 2)), ''))) as "areaName"
      from ${simulationUploadedRows}
      where ${simulationUploadedRows.simulationJobId} = ${jobId}
        and deleted_at is null
        and is_ignored = false
    )
    select
      "areaName",
      count(*) :: int as "totalOrders"
    from normalized_areas
    where "areaName" is not null
    group by "areaName"
    order by "totalOrders" desc, "areaName" asc
  `);

  return result.rows;
};
