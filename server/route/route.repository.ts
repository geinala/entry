import { courierRouteTable, courierTable, routeLegTable, solutionTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { TLatestRouteBySimulationRow } from "@/types/database";

export const getLatestRouteBySimulationIdRepository = async (
  simulationId: string,
  courierId?: number,
): Promise<TLatestRouteBySimulationRow[]> => {
  const courierFilter = courierId ? sql`AND vr.courier_id = ${courierId}` : sql``;

  const result = await db.execute(sql<TLatestRouteBySimulationRow>`
    SELECT 
      rl.id,
      json_build_object('id', v.id, 'name', v.name) AS courier,
      vr.is_active,
      rl.origin_latitude,
      rl.origin_longitude,
      rl.destination_latitude,
      rl.destination_longitude,
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
      rl.live_traffic_incidents_travel_time_in_seconds,
      rl.route_status
    FROM ${solutionTable} s
    JOIN (
      SELECT DISTINCT ON (vr.solution_id, vr.courier_id) *
      FROM ${courierRouteTable} vr
      WHERE true
      ${courierFilter}
      ORDER BY vr.solution_id, vr.courier_id, vr.route_version DESC
    ) vr ON s.id = vr.solution_id
    JOIN ${courierTable} v ON vr.courier_id = v.id
    JOIN ${routeLegTable} rl ON vr.id = rl.courier_route_id
    WHERE s.simulation_id = ${simulationId}
  `);

  return result.rows as TLatestRouteBySimulationRow[];
};
