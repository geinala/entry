import { simulationUploadedRows, simulationJobTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import {
  TSimulationJobAreaDistributionRow,
  TSimulationJobSummaryBaseRow,
  TSimulationJobCombinedSummaryRow,
} from "@/types/database";
import { and, eq, sql } from "drizzle-orm";

export const getAllUploadedRowsRepository = async (jobId: string) => {
  return await db
    .select()
    .from(simulationUploadedRows)
    .where(eq(simulationUploadedRows.simulationJobId, jobId));
};

export const getSimulationJobSummaryBaseRepository = async (
  userId: string,
  jobId: string,
): Promise<TSimulationJobSummaryBaseRow | null> => {
  const [job] = await db
    .select({
      id: simulationJobTable.id,
      depotLocationAddress: simulationJobTable.depotLocationAddress,
      depotLocationLatitude: simulationJobTable.depotLocationLatitude,
      depotLocationLongitude: simulationJobTable.depotLocationLongitude,
      fileTotalRows: simulationJobTable.fileTotalRows,
    })
    .from(simulationJobTable)
    .where(and(eq(simulationJobTable.id, jobId), eq(simulationJobTable.userId, userId)))
    .limit(1);

  return job ?? null;
};

/**
 * Fetches dataset metrics and geocoding metrics in a single query instead of two,
 * eliminating one round-trip to the database.
 *
 * Replaces:
 *   getSimulationJobDatasetSummaryRepository
 *   getSimulationJobGeocodingSummaryRepository
 */
export const getSimulationJobCombinedSummaryRepository = async (
  jobId: string,
): Promise<TSimulationJobCombinedSummaryRow> => {
  const result: { rows: TSimulationJobCombinedSummaryRow[] } =
    await db.execute(sql<TSimulationJobCombinedSummaryRow>`
      select
        -- dataset summary
        count(*) filter (where deleted_at is null) :: int
          as "validOrders",
        count(*) filter (where deleted_at is null and is_ignored = true) :: int
          as "ignoredOrders",
        count(distinct nullif(trim(courier), '')) filter (
          where deleted_at is null and is_ignored = false
        ) :: int
          as "courierCount",
        coalesce(
          sum(weight) filter (where deleted_at is null and is_ignored = false),
          0
        ) :: float8
          as "estimatedTotalWeightKg",
        -- geocoding summary
        count(*) filter (
          where deleted_at is null
            and is_ignored = false
            and resolution_status = 'auto_solved'
        ) :: int
          as "autoResolved",
        count(*) filter (
          where deleted_at is null
            and is_ignored = false
            and resolution_status = 'manual_override'
        ) :: int
          as "manuallyCorrected",
        count(*) filter (where deleted_at is null and is_ignored = true) :: int
          as "ignored"
      from ${simulationUploadedRows}
      where ${simulationUploadedRows.simulationJobId} = ${jobId}
    `);

  return (
    result.rows[0] ?? {
      validOrders: 0,
      ignoredOrders: 0,
      courierCount: 0,
      estimatedTotalWeightKg: 0,
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
