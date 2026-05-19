import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  userTable,
  waitlistTable,
  waitlistStatusEnum,
  roleTable,
  simulationTable,
  nodeTable,
  courierTable,
  routeLegTable,
  courierRouteTable,
  simulationJobTable,
  simulationJobFileValidationStatusEnum,
  simulationUploadedRows,
  nodeDetailTable,
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

// Simulation Job Uploaded File Error Types
export type TSimulationUploadedRow = InferSelectModel<typeof simulationUploadedRows>;

// Simulation Types
export type TSimulation = InferSelectModel<typeof simulationTable>;
export type TSimulationWithDepot = TSimulation & {
  depot: TNode | null;
};
export type TUpdateSimulation = Partial<Omit<TSimulation, "id" | "createdAt" | "updatedAt">>;
export type TSimulationWithUploadedFile = TSimulation & {
  totalDemand: number;
};

// Node Types
export type TNode = InferSelectModel<typeof nodeTable>;
export type TNewNode = InferInsertModel<typeof nodeTable>;
export type TNewNodeDetail = InferInsertModel<typeof nodeDetailTable>;

// Courier Types
export type TCourier = InferSelectModel<typeof courierTable>;
export type TNewCourier = InferInsertModel<typeof courierTable>;

// Route Types
export type TCourierRoute = InferSelectModel<typeof courierRouteTable>;
export type TRouteLeg = InferSelectModel<typeof routeLegTable>;

export type TRouteCourierSummary = {
  id: TCourier["id"];
  name: TCourier["name"];
};

export type TLatestRouteBySimulationRow = {
  id: TRouteLeg["id"];
  vehicle: TRouteCourierSummary;
  is_active: TCourierRoute["isActive"];
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

export type TSimulationJobFileValidationStatusEnum =
  (typeof simulationJobFileValidationStatusEnum.enumValues)[number];

// Simulation Job Summary Types
export type TSimulationJobDatasetSummary = {
  totalOrders: number;
  validOrders: number;
  ignoredOrders: number;
  courierCount: number;
  depotName: string;
  estimatedTotalWeightKg: number;
};

export type TSimulationJobGeocodingSummary = {
  autoResolved: number;
  manuallyCorrected: number;
  ignored: number;
};

export type TSimulationJobAreaDistributionItem = {
  areaName: string;
  totalOrders: number;
};

export type TSimulationJobSummary = {
  datasetSummary: TSimulationJobDatasetSummary;
  geocodingSummary: TSimulationJobGeocodingSummary;
  areaDistribution: TSimulationJobAreaDistributionItem[];
};

// Simulation Job Summary Row Types (Internal)
export type TSimulationJobSummaryBaseRow = {
  id: string;
  depotLocationAddress: string;
  fileTotalRows: number | null;
};

export type TSimulationJobDatasetSummaryRow = {
  validOrders: number;
  ignoredOrders: number;
  courierCount: number;
  estimatedTotalWeightKg: number;
};

export type TSimulationJobGeocodingSummaryRow = {
  autoResolved: number;
  manuallyCorrected: number;
  ignored: number;
};

export type TSimulationJobCombinedSummaryRow = {
  validOrders: number;
  ignoredOrders: number;
  courierCount: number;
  estimatedTotalWeightKg: number;
  autoResolved: number;
  manuallyCorrected: number;
  ignored: number;
};

export type TSimulationJobAreaDistributionRow = {
  areaName: string;
  totalOrders: number;
};
