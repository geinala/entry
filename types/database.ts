import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  userTable,
  waitlistTable,
  waitlistStatusEnum,
  roleTable,
  simulationTable,
  simulationUploadedFileTable,
  simulationStatusEnum,
  nodeTable,
  vehicleTable,
  routeLegTable,
  vehicleRouteTable,
  simulationJobTable,
} from "@/drizzle/schema";

// User Types
export type TUser = InferSelectModel<typeof userTable>;

// Role Types
export type TRole = InferSelectModel<typeof roleTable>;

// User with Role and Permissions
export type TUserWithRoleAndPermissionNames = TUser & {
  role: string;
  permissions: string[];
};

// Waitlist Types
export type TWaitlistEntry = InferSelectModel<typeof waitlistTable>;
export type TNewWaitlistEntry = InferInsertModel<typeof waitlistTable>;
export type TWaitlistStatus = (typeof waitlistStatusEnum.enumValues)[number];

// Simulation Job Types
export type TSimulationJob = InferSelectModel<typeof simulationJobTable>;
export type TUpdateSimulationJob = Partial<Omit<TSimulationJob, "id" | "createdAt">>;

// Simulation Types
export type TSimulation = InferSelectModel<typeof simulationTable>;
export type TSimulationWithDepot = TSimulation & {
  depot: TNode | null;
};
export type TUpdateSimulation = Partial<Omit<TSimulation, "id" | "createdAt" | "updatedAt">>;
export type TSimulationWithUploadedFile = TSimulation & {
  uploadedFile: TSimulationUploadedFile | null;
  totalDemand: number;
};

// Simulation Uploaded File Types
export type TSimulationUploadedFile = InferSelectModel<typeof simulationUploadedFileTable>;
export type TNewSimulationUploadedFile = InferInsertModel<typeof simulationUploadedFileTable>;
export type TSimulationStatus = (typeof simulationStatusEnum.enumValues)[number];

// Node Types
export type TNode = InferSelectModel<typeof nodeTable>;

// Vehicle Types
export type TVehicle = InferSelectModel<typeof vehicleTable>;
export type TNewVehicle = InferInsertModel<typeof vehicleTable>;

// Route Types
export type TVehicleRoute = InferSelectModel<typeof vehicleRouteTable>;
export type TRouteLeg = InferSelectModel<typeof routeLegTable>;

export type TRouteVehicleSummary = {
  id: TVehicle["id"];
  name: TVehicle["name"];
};

export type TLatestRouteBySimulationRow = {
  id: TRouteLeg["id"];
  vehicle: TRouteVehicleSummary;
  is_active: TVehicleRoute["isActive"];
  origin_latitude: TNode["latitude"];
  origin_longitude: TNode["longitude"];
  destination_latitude: TNode["latitude"];
  destination_longitude: TNode["longitude"];
  sequence: TRouteLeg["sequence"];
  encoded_polyline: TRouteLeg["encodedPolyline"];
  encoded_polyline_precision: TRouteLeg["encodedPolylinePrecision"];
  distance_in_meters: TRouteLeg["distanceInMeters"];
  travel_time_in_seconds: TRouteLeg["travelTimeInSeconds"];
  traffic_delay_in_seconds: TRouteLeg["trafficDelayInSeconds"];
  traffic_distance_in_meters: TRouteLeg["trafficDistanceInMeters"];
  departure_time: TRouteLeg["departureTime"];
  arrival_time: TRouteLeg["arrivalTime"];
  no_traffic_travel_time_in_seconds: TRouteLeg["noTrafficTravelTimeInSeconds"];
  historic_traffic_travel_time_in_seconds: TRouteLeg["historicTrafficTravelTimeInSeconds"];
  live_traffic_incidents_travel_time_in_seconds: TRouteLeg["liveTrafficIncidentsTravelTimeInSeconds"];
  route_status: TRouteLeg["routeStatus"];
};
