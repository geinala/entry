import { nodeTable, routeLegTable, solutionTable, vehicleRouteTable, vehicleTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { TLatestRouteBySimulationRow } from "@/types/database";

export const getLatestRouteBySimulationIdRepository = async (
  simulationId: string,
): Promise<TLatestRouteBySimulationRow[]> => {
  const result = await db.execute(sql<TLatestRouteBySimulationRow>`
    SELECT 
      rl.id,
      json_build_object('id', v.id, 'name', v.name) AS vehicle,
      vr.is_active,
      orn.latitude AS origin_latitude, orn.longitude AS origin_longitude,
      ds.latitude AS destination_latitude, ds.longitude AS destination_longitude,
      rl.sequence,
      rl.encoded_polyline,
      rl.encoded_polyline_precision,
      rl.distance_in_meters,
      rl.travel_time_in_seconds,
      rl.traffic_delay_in_seconds,
      rl.traffic_distance_in_meters,
      rl.departure_time,
      rl.arrival_time,
      rl.no_traffic_travel_time_in_seconds,
      rl.historic_traffic_travel_time_in_seconds,
      rl.live_traffic_incidents_travel_time_in_seconds
    FROM ${solutionTable} s
    JOIN (
      SELECT DISTINCT ON (vr.solution_id, vr.vehicle_id) *
      FROM ${vehicleRouteTable} vr
      ORDER BY vr.solution_id, vr.vehicle_id, vr.route_version DESC
    ) vr ON s.id = vr.solution_id
    JOIN ${vehicleTable} v ON vr.vehicle_id = v.id
    JOIN ${routeLegTable} rl ON vr.id = rl.vehicle_route_id
    JOIN ${nodeTable} orn ON rl.origin_node_id = orn.id
    JOIN ${nodeTable} ds ON rl.destination_node_id = ds.id
    WHERE s.simulation_id = ${simulationId}
  `);

  return result.rows as TLatestRouteBySimulationRow[];
};
