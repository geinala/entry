import { TTrafficIncidentGeometry } from "@/types/database";
import {
  boolean,
  doublePrecision,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable(
  "users",
  {
    id: varchar("user_id").notNull().unique().primaryKey(), // This is the Clerk user ID, which is a string. We use it as the primary key for the users table to simplify integration with Clerk.
    email: varchar("email").notNull().unique(),
    fullName: varchar("full_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("users_user_id_idx").on(table.id)],
);

export const simulationJobStatusEnum = pgEnum("simulation_job_status_enum", [
  "uploaded", // uploaded === draft, just uploaded but not processed yet
  "processing",
  "completed",
  "failed",
]);

export const geocodingStatusEnum = pgEnum("geocoding_status_enum", [
  "pending",
  "in_progress",
  "needed_review",
  "completed",
  "failed",
]);

export const calculationStatusEnum = pgEnum("calculation_status_enum", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const simulationJobFileValidationStatusEnum = pgEnum(
  "simulation_file_validation_status_enum",
  ["uploaded", "validating", "validated", "needed_review", "completed", "failed"],
);

export const simulationJobCleaningStatusEnum = pgEnum("simulation_cleaning_status_enum", [
  "pending",
  "in_progress",
  "completed",
  "needed_review",
  "failed",
]);

export const optimizationAlgorithmEnum = pgEnum("optimization_algorithm_enum", [
  "manual_without_optimization",
  "manual_with_optimization",
  "google_or_tools",
]);

export const simulationJobTable = pgTable(
  "simulation_jobs",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar("user_id")
      .references(() => userTable.id)
      .notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    status: simulationJobStatusEnum("status").notNull().default("uploaded"),
    currentStep: integer("current_step").notNull().default(0),
    startedAt: timestamp("started_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    depotId: integer("depot_id")
      .references(() => depotTable.id)
      .notNull(),
    depotLocationAddress: varchar("depot_location_address").notNull(),
    depotLocationLatitude: doublePrecision("depot_location_latitude").notNull(),
    depotLocationLongitude: doublePrecision("depot_location_longitude").notNull(),
    algorithm: optimizationAlgorithmEnum("algorithm").notNull().default("google_or_tools"),
    computationTimeLimitInSeconds: integer("computation_time_limit_in_seconds")
      .notNull()
      .default(600),
    randomSeed: integer("random_seed").notNull().default(42),
    enableResequence: boolean("enable_resequence").notNull().default(true),
    enableAspiration: boolean("enable_aspiration").notNull().default(true),
    resequenceImprovementThresholdPercent: real("resequence_improvement_threshold_percent").default(
      5,
    ),
    congestionDelayThresholdInSeconds: integer("congestion_delay_threshold_in_seconds").default(
      300,
    ),
    earlyStopNoImprovementIterations: integer("early_stop_no_improvement_iterations").default(100),
    tabuIterations: integer("tabu_iterations"),
    tabuTenure: integer("tabu_tenure"),
    maxNeighbors2Opt: integer("max_neighbors_2opt"),
    diversifyAfterIterations: integer("diversify_after_iterations"),
    diversificationStrength: integer("diversification_strength"),
    totalDemandInKilograms: real("total_demand_in_kilograms").notNull().default(0),
    totalCouriers: integer("total_couriers").notNull().default(0),
    totalActiveCouriers: integer("total_active_couriers").notNull().default(0),
    totalNodes: integer("total_nodes").notNull().default(0),
    filePath: varchar("file_path"),
    fileValidationStatus: simulationJobFileValidationStatusEnum("file_validation_status")
      .notNull()
      .default("uploaded"),
    fileTotalRows: integer("file_total_rows"),
    fileValidRows: integer("file_valid_rows").notNull().default(0),
    fileInvalidRows: integer("file_invalid_rows").notNull().default(0),
    fileProcessedRows: integer("file_processed_rows"),
    fileProgressPercentage: integer("file_progress_percentage").default(0),
    fileValidationStartedAt: timestamp("file_validation_started_at", {
      withTimezone: true,
    }),
    fileValidationCompletedAt: timestamp("file_validation_completed_at", {
      withTimezone: true,
    }),
    cleaningStatus: simulationJobCleaningStatusEnum("cleaning_status").notNull().default("pending"),
    cleaningTotalRows: integer("cleaning_total_rows").default(0),
    cleaningProcessedRows: integer("cleaning_processed_rows").default(0),
    cleaningProgressPercentage: integer("cleaning_progress_percentage").default(0),
    cleaningStartedAt: timestamp("cleaning_started_at", {
      withTimezone: true,
    }),
    cleaningCompletedAt: timestamp("cleaning_completed_at", {
      withTimezone: true,
    }),
    geocodingStatus: geocodingStatusEnum("geocoding_status").notNull().default("pending"),
    geocodingTotalRows: integer("geocoding_total_rows").default(0),
    geocodingProcessedRows: integer("geocoding_processed_rows").default(0),
    geocodingProgressPercentage: integer("geocoding_progress_percentage").default(0),
    geocodingEstimatedCompletionTime: timestamp("geocoding_estimated_completion_time", {
      withTimezone: true,
    }),
    geocodingStartedAt: timestamp("geocoding_started_at", {
      withTimezone: true,
    }),
    geocodedAt: timestamp("geocoded_at", {
      withTimezone: true,
    }),
    calculationStatus: calculationStatusEnum("calculation_status").notNull().default("pending"),
    calculationStartedAt: timestamp("calculation_started_at", {
      withTimezone: true,
    }),
    calculatedAt: timestamp("calculated_at", {
      withTimezone: true,
    }),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.id],
      name: "simulation_jobs_user_id_users_id_fk",
    }),
    foreignKey({
      columns: [table.depotId],
      foreignColumns: [depotTable.id],
      name: "simulation_jobs_depot_id_depots_id_fk",
    }),
    index("simulation_jobs_user_id_idx").on(table.userId),
    index("simulation_jobs_status_idx").on(table.status),
    index("simulation_jobs_depot_id_idx").on(table.depotId),
  ],
);

export const resolutionStatusEnum = pgEnum("resolution_status", [
  "pending",
  "auto_solved",
  "needed_review",
  "failed",
  "manual_override",
]);

export const simulationUploadedRows = pgTable(
  "simulation_uploaded_rows",
  {
    id: serial().primaryKey(),
    simulationJobId: uuid("simulation_job_id").references(() => simulationJobTable.id),
    nosi: varchar("nosi"),
    courier: varchar("courier"),
    customerName: varchar("customer_name"),
    address: varchar("address"),
    normalizedAddress: varchar("normalized_address"),
    suggestedAddress: varchar("suggested_address"),
    finalAddress: varchar("final_address"),
    city: varchar("city"),
    weight: real("weight"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    geocodeScore: doublePrecision("geocode_score"),
    geocodeProvider: varchar("geocode_provider"), // TomTom API
    geocodeResponse: jsonb("geocode_response"),
    resolutionStatus: resolutionStatusEnum("resolution_status").notNull().default("pending"),
    resolutionSource: varchar("resolution_source"), // e.g., "SYSTEM" or "USER"
    isIgnored: boolean("is_ignored").notNull().default(false), // To mark rows that should be ignored in processing
    startDatetime: timestamp("start_datetime", { withTimezone: true }),
    endDatetime: timestamp("end_datetime", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // To mark when a row is "soft deleted"
    errorDetails: jsonb("error_details"), // To store any error details related to this row during processing
  },
  (table) => [
    foreignKey({
      columns: [table.simulationJobId],
      foreignColumns: [simulationJobTable.id],
      name: "simulation_uploaded_rows_simulation_job_id_simulation_jobs_id_fk",
    }),
    index("simulation_uploaded_rows_simulation_job_id_idx").on(table.simulationJobId),
    index("simulation_uploaded_rows_nosi_idx").on(table.nosi),
  ],
);

export const simulationStatusEnum = pgEnum("simulation_status_enum", [
  "pending",
  "stopped",
  "optimizing",
  "running",
  "completed",
  "failed",
]);

export const simulationTable = pgTable(
  "simulations",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar("user_id")
      .references(() => userTable.id)
      .notNull(),
    simulationJobId: uuid("simulation_job_id")
      .references(() => simulationJobTable.id)
      .notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    status: simulationStatusEnum("status").notNull().default("optimizing"),
    startedAt: timestamp("started_at", {
      withTimezone: true,
    }),
    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),
    algorithm: optimizationAlgorithmEnum("algorithm").notNull(),
    computationTimeLimitInSeconds: integer("computation_time_limit_in_seconds")
      .notNull()
      .default(600),
    randomSeed: integer("random_seed").notNull().default(42),
    enableResequence: boolean("enable_resequence").notNull().default(true),
    enableAspiration: boolean("enable_aspiration").notNull().default(true),
    resequenceImprovementThresholdPercent: real("resequence_improvement_threshold_percent").default(
      5,
    ),
    congestionDelayThresholdInSeconds: integer("congestion_delay_threshold_in_seconds").default(
      300,
    ),
    earlyStopNoImprovementIterations: integer("early_stop_no_improvement_iterations").default(100),
    tabuIterations: integer("tabu_iterations"),
    tabuTenure: integer("tabu_tenure"),
    maxNeighbors2Opt: integer("max_neighbors_2opt"),
    diversifyAfterIterations: integer("diversify_after_iterations"),
    diversificationStrength: integer("diversification_strength"),
    depotId: integer("depot_id")
      .references(() => depotTable.id)
      .notNull(),
    depotLocationAddress: varchar("depot_location_address").notNull(),
    depotLocationLatitude: doublePrecision("depot_location_latitude").notNull(),
    depotLocationLongitude: doublePrecision("depot_location_longitude").notNull(),
    totalDemandInKilograms: real("total_demand_in_kilograms").notNull().default(0),
    totalCouriers: integer("total_couriers").notNull().default(0),
    totalActiveCouriers: integer("total_active_couriers").notNull().default(0),
    totalCompletedNodes: integer("total_completed_nodes").notNull().default(0),
    totalNodes: integer("total_nodes").notNull().default(0),
    initialTotalDistanceInMeters: integer("initial_total_distance_in_meters").notNull().default(0),
    initialTotalDurationInSeconds: integer("initial_total_duration_in_seconds")
      .notNull()
      .default(0),
    finalTotalDistanceInMeters: integer("final_total_distance_in_meters").notNull().default(0),
    finalTotalDurationInSeconds: integer("final_total_duration_in_seconds").notNull().default(0),
    distanceImprovementInMeters: integer("distance_improvement_in_meters").notNull().default(0),
    durationImprovementInSeconds: integer("duration_improvement_in_seconds").notNull().default(0),
    totalReoptimizedRoutes: integer("total_reoptimized_routes").notNull().default(0),
    totalIncidentsAffectingRoutes: integer("total_incidents_affecting_routes").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userTable.id],
      name: "simulations_user_id_users_id_fk",
    }),
    foreignKey({
      columns: [table.depotId],
      foreignColumns: [depotTable.id],
      name: "simulations_depot_id_depots_id_fk",
    }),
    foreignKey({
      columns: [table.simulationJobId],
      foreignColumns: [simulationJobTable.id],
      name: "simulations_simulation_job_id_simulation_jobs_id_fk",
    }),
    index("simulations_user_id_idx").on(table.userId),
    index("simulations_depot_id_idx").on(table.depotId),
    index("simulations_status_idx").on(table.status),
  ],
);

export const nodeTable = pgTable(
  "nodes",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    courierId: integer("courier_id").references(() => courierTable.id),
    matrixIndex: integer("matrix_index").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    completedBy: integer("completed_by").references(() => courierTable.id),
    demand: real("demand").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "nodes_simulation_id_simulations_id_fk",
    }),
    foreignKey({
      columns: [table.courierId],
      foreignColumns: [courierTable.id],
      name: "nodes_courier_id_couriers_id_fk",
    }),
    foreignKey({
      columns: [table.completedBy],
      foreignColumns: [courierTable.id],
      name: "nodes_completed_by_courier_id_couriers_id_fk",
    }),
    index("nodes_simulation_id_idx").on(table.simulationId),
  ],
);

export const nodeDetailTable = pgTable(
  "node_details",
  {
    id: serial().primaryKey(),
    nodeId: integer("node_id").references(() => nodeTable.id),
    name: varchar("name").notNull(),
    address: varchar("address").notNull(),
    city: varchar("city").notNull(),
    weight: real("weight").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.nodeId],
      foreignColumns: [nodeTable.id],
      name: "node_details_node_id_nodes_id_fk",
    }),
    index("node_details_node_id_idx").on(table.nodeId),
  ],
);

export const matrixBatchStatusEnum = pgEnum("matrix_batch_status_enum", [
  "submitted",
  "validated",
  "completed",
  "failed",
]);

export const matrixBatchTable = pgTable(
  "matrix_batches",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    originStartIndex: integer("origin_start_index").notNull(),
    originEndIndex: integer("origin_end_index").notNull(),
    destinationStartIndex: integer("destination_start_index").notNull(),
    destinationEndIndex: integer("destination_end_index").notNull(),
    tomtomJobId: varchar("tomtom_job_id").notNull(),
    status: matrixBatchStatusEnum("status").notNull().default("submitted"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "matrix_batches_simulation_id_simulations_id_fk",
    }),
    index("matrix_batches_simulation_id_idx").on(table.simulationId),
  ],
);

export const matrixResultTable = pgTable(
  "matrix_results",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    originIndex: integer("origin_index").notNull(),
    destinationIndex: integer("destination_index").notNull(),
    lengthInMeters: integer("length_in_meters").notNull(),
    travelTimeInSeconds: integer("travel_time_in_seconds").notNull(),
    trafficDelayInSeconds: integer("traffic_delay_in_seconds").notNull(),
    matrixBatchId: integer("matrix_batch_id").references(() => matrixBatchTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.matrixBatchId],
      foreignColumns: [matrixBatchTable.id],
      name: "matrix_results_matrix_batch_id_matrix_batches_id_fk",
    }),
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "matrix_results_simulation_id_simulations_id_fk",
    }),
    index("matrix_results_simulation_id_idx").on(table.simulationId),
    index("matrix_results_matrix_batch_id_idx").on(table.matrixBatchId),
  ],
);

export const courierTable = pgTable(
  "couriers",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    name: varchar("name").notNull(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "couriers_simulation_id_simulations_id_fk",
    }),
    index("couriers_simulation_id_idx").on(table.simulationId),
  ],
);

export const solutionTable = pgTable(
  "solutions",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    courierId: integer("courier_id").references(() => courierTable.id),
    routes: jsonb("routes").notNull(), // Array of node indices representing the route
    demandInKilograms: real("demand_in_kilograms").notNull(), // Total demand served by this vehicle
    timeInSeconds: integer("time_in_seconds").notNull(), // Total time for this route
    distanceInMeters: integer("distance_in_meters").notNull(), // Total distance for this route
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "solutions_simulation_id_simulations_id_fk",
    }),
    foreignKey({
      columns: [table.courierId],
      foreignColumns: [courierTable.id],
      name: "solutions_courier_id_couriers_id_fk",
    }),
    index("solutions_simulation_id_idx").on(table.simulationId),
    index("solutions_courier_id_idx").on(table.courierId),
  ],
);

export const courierRouteTable = pgTable(
  "courier_routes",
  {
    id: serial().primaryKey(),
    solutionId: integer("solution_id").references(() => solutionTable.id),
    courierId: integer("courier_id").references(() => courierTable.id),
    routeVersion: integer("route_version").notNull().default(1), // To track changes in routes over time
    isActive: boolean("is_active").notNull().default(true), // To indicate if this route is currently active
    totalDistanceInMeters: integer("total_distance_in_meters").notNull(), // Total distance for this route
    totalTimeInSeconds: integer("total_time_in_seconds").notNull(), // Total time for this route
    reoptimizedFromRouteId: integer("reoptimized_from_route_id"),
    triggerNodeId: integer("trigger_node_id").references(() => nodeTable.id),
    triggeredByTraffic: boolean("triggered_by_traffic").default(false),
    isInitialRoute: boolean("is_initial_route").notNull().default(false), // To indicate if this route is part of the initial solution before any re-optimizations
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.solutionId],
      foreignColumns: [solutionTable.id],
      name: "courier_routes_solution_id_solutions_id_fk",
    }),
    foreignKey({
      columns: [table.courierId],
      foreignColumns: [courierTable.id],
      name: "courier_routes_courier_id_couriers_id_fk",
    }),
    foreignKey({
      columns: [table.reoptimizedFromRouteId],
      foreignColumns: [table.id],
      name: "courier_routes_reoptimized_from_route_id_courier_routes_id_fk",
    }),
    index("courier_routes_solution_id_idx").on(table.solutionId),
    index("courier_routes_courier_id_idx").on(table.courierId),
  ],
);

export const routeStatusEnum = pgEnum("route_status_enum", [
  "baseline_planned",
  "baseline_running",
  "baseline_completed",
  "planned",
  "running",
  "completed",
  "cancelled",
]);

export const routeLegTable = pgTable(
  "route_legs",
  {
    id: serial().primaryKey(),
    courierRouteId: integer("courier_route_id").references(() => courierRouteTable.id),
    fromNodeId: integer("from_node_id").references(() => nodeTable.id),
    toNodeId: integer("to_node_id").references(() => nodeTable.id),
    originLatitude: doublePrecision("origin_latitude").notNull(),
    originLongitude: doublePrecision("origin_longitude").notNull(),
    destinationLatitude: doublePrecision("destination_latitude").notNull(),
    destinationLongitude: doublePrecision("destination_longitude").notNull(),
    sequence: integer("sequence").notNull(), // To maintain the order of legs in the route
    encodedPolyline: text("encoded_polyline").notNull(), // To store the encoded polyline for this leg
    encodedPolylinePrecision: integer("encoded_polyline_precision").notNull().default(5), // Precision of the encoded polyline
    distanceInMeters: integer("distance_in_meters").notNull(),
    travelTimeInSeconds: integer("travel_time_in_seconds").notNull(),
    trafficDelayInSeconds: integer("traffic_delay_in_seconds").notNull(),
    trafficDistanceInMeters: integer("traffic_distance_in_meters").notNull(),
    departureTime: timestamp("departure_time", { withTimezone: true }).notNull(),
    arrivalTime: timestamp("arrival_time", { withTimezone: true }).notNull(),
    noTrafficTravelTimeInSeconds: integer("no_traffic_travel_time_in_seconds").notNull(),
    historicTrafficTravelTimeInSeconds: integer(
      "historic_traffic_travel_time_in_seconds",
    ).notNull(),
    liveTrafficIncidentsTravelTimeInSeconds: integer(
      "live_traffic_incidents_travel_time_in_seconds",
    ).notNull(),
    routeStatus: routeStatusEnum("route_status").notNull().default("planned"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.courierRouteId],
      foreignColumns: [courierRouteTable.id],
      name: "route_legs_courier_route_id_courier_routes_id_fk",
    }),
    index("route_legs_courier_route_id_idx").on(table.courierRouteId),
    index("route_legs_origin_coordinates_idx").on(table.originLatitude, table.originLongitude),
    index("route_legs_destination_coordinates_idx").on(
      table.destinationLatitude,
      table.destinationLongitude,
    ),
    uniqueIndex("route_legs_courier_route_sequence_unique").on(
      table.courierRouteId,
      table.sequence,
    ),
    index("route_legs_sequence_idx").on(table.sequence),
  ],
);

export const optimizationRunTable = pgTable(
  "optimization_runs",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    congestionCheckId: integer("congestion_check_id").references(
      () => routeLegCongestionCheckTable.id,
    ),
    courierId: integer("courier_id")
      .references(() => courierTable.id)
      .notNull(),
    runType: varchar("run_type").notNull(),
    algorithm: varchar("algorithm"),
    triggerType: varchar("trigger_type").notNull(),
    totalDistanceInMeters: integer("total_distance_in_meters").notNull(),
    totalTravelTimeInSeconds: integer("total_travel_time_in_seconds").notNull(),
    computationTimeInMs: real("computation_time_in_ms").notNull(),
    totalNodesExplored: integer("total_nodes_explored").notNull(),
    triggeredAt: timestamp("triggered_at", { withTimezone: true }).notNull(),
    beforeTotalDistanceInMeters: integer("before_total_distance_in_meters"),
    beforeTotalTravelTimeInSeconds: integer("before_total_travel_time_in_seconds"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "optimization_runs_simulation_id_simulations_id_fk",
    }),
    foreignKey({
      columns: [table.congestionCheckId],
      foreignColumns: [routeLegCongestionCheckTable.id],
      name: "optimization_runs_congestion_check_id_route_leg_congestion_checks_id_fk",
    }),
    index("optimization_runs_simulation_id_idx").on(table.simulationId),
    index("optimization_runs_congestion_check_id_idx").on(table.congestionCheckId),
  ],
);

export const simulationLogTable = pgTable(
  "simulation_logs",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    courierRouteId: integer("courier_route_id").references(() => courierRouteTable.id),
    courierId: integer("courier_id").references(() => courierTable.id),
    logLevel: varchar("log_level").notNull(),
    eventType: varchar("event_type").notNull(),
    title: varchar("title").notNull(),
    description: text("description"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "simulation_logs_simulation_id_simulations_id_fk",
    }),
    foreignKey({
      columns: [table.courierRouteId],
      foreignColumns: [courierRouteTable.id],
      name: "simulation_logs_courier_route_id_courier_routes_id_fk",
    }),
    foreignKey({
      columns: [table.courierId],
      foreignColumns: [courierTable.id],
      name: "simulation_logs_courier_id_couriers_id_fk",
    }),
    index("simulation_logs_simulation_id_idx").on(table.simulationId),
    index("simulation_logs_courier_route_id_idx").on(table.courierRouteId),
    index("simulation_logs_courier_id_idx").on(table.courierId),
  ],
);

export const depotTable = pgTable(
  "depots",
  {
    id: serial().primaryKey(),
    name: varchar("name").notNull(),
    address: varchar("address").notNull(),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("depots_name_idx").on(table.name),
    index("depots_coordinates_idx").on(table.latitude, table.longitude),
  ],
);

export const trafficIncidentTable = pgTable("traffic_incidents", {
  id: serial().primaryKey(),
  tomtomIncidentId: varchar("tomtom_incident_id").notNull().unique(),
  simulationId: uuid("simulation_id").references(() => simulationTable.id),
  detectedAt: timestamp("detected_at", { withTimezone: true }).notNull(), // Kapan ditemukan
  category: smallint("category").notNull(), // Kategori insiden menurut TomTom
  delayInSeconds: integer("delay_in_seconds").notNull(), // Perkiraan delay yang disebabkan oleh insiden ini
  geometry: jsonb("geometry").$type<TTrafficIncidentGeometry>().notNull(), // Geometri insiden, bisa berupa titik, garis, atau poligon
  startTime: timestamp("start_time", { withTimezone: true }).notNull(), // Kapan insiden dimulai
  endTime: timestamp("end_time", { withTimezone: true }), // Kapan insiden berakhir (jika sudah berakhir)
  lengthInMeters: integer("length_in_meters"), // Panjang area yang terdampak oleh insiden ini
  fromAddress: varchar("from_address"), // Alamat awal insiden
  toAddress: varchar("to_address"), // Alamat akhir insiden
  incidentDescription: text("incident_description"), // Deskripsi insiden dari TomTom
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reoptimizationOutcomeEnum = pgEnum("reoptimization_outcome_enum", [
  "resequencing_applied",
  "duration_updated",
  "no_improvement",
]);

export const reoptimizationEventTable = pgTable(
  "reoptimization_events",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    optimizationRunId: integer("optimization_run_id").references(() => optimizationRunTable.id),
    congestionCheckId: integer("congestion_check_id").references(
      () => routeLegCongestionCheckTable.id,
    ),
    reoptSequence: integer("reopt_sequence").notNull(),
    triggeredAt: timestamp("triggered_at", { withTimezone: true }).notNull(),
    beforeRouteId: integer("before_route_id").references(() => courierRouteTable.id),
    beforeTotalDistanceInMeters: integer("before_total_distance_in_meters").notNull(),
    beforeTotalTimeInSeconds: integer("before_total_time_in_seconds").notNull(),
    afterRouteId: integer("after_route_id").references(() => courierRouteTable.id),
    afterTotalDistanceInMeters: integer("after_total_distance_in_meters").notNull(),
    afterTotalTimeInSeconds: integer("after_total_time_in_seconds").notNull(),
    distanceSavedInMeters: integer("distance_saved_in_meters").notNull(),
    timeSavedInSeconds: integer("time_saved_in_seconds").notNull(),
    courierPosition: jsonb("courier_position").notNull(),
    algorithmUsed: varchar("algorithm_used"),
    computationTimeInMs: real("computation_time_in_ms").notNull(),
    totalIncidentDelayInSeconds: integer("total_incident_delay_in_seconds"), // sum delay semua incident valid dalam congestion check ini
    outcome: reoptimizationOutcomeEnum("outcome").notNull(),
    triggerRouteLegId: integer("trigger_route_leg_id").references(() => routeLegTable.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "reoptimization_events_simulation_id_simulations_id_fk",
    }),
    foreignKey({
      columns: [table.optimizationRunId],
      foreignColumns: [optimizationRunTable.id],
      name: "reoptimization_events_optimization_run_id_optimization_runs_id_fk",
    }),
    foreignKey({
      columns: [table.congestionCheckId],
      foreignColumns: [routeLegCongestionCheckTable.id],
      name: "reoptimization_events_congestion_check_id_route_leg_congestion_checks_id_fk",
    }),
    foreignKey({
      columns: [table.beforeRouteId],
      foreignColumns: [courierRouteTable.id],
      name: "reoptimization_events_before_route_id_courier_routes_id_fk",
    }),
    foreignKey({
      columns: [table.afterRouteId],
      foreignColumns: [courierRouteTable.id],
      name: "reoptimization_events_after_route_id_courier_routes_id_fk",
    }),
    foreignKey({
      columns: [table.triggerRouteLegId],
      foreignColumns: [routeLegTable.id],
      name: "reoptimization_events_trigger_route_leg_id_route_legs_id_fk",
    }),
    index("reoptimization_events_simulation_id_idx").on(table.simulationId),
    index("reoptimization_events_optimization_run_id_idx").on(table.optimizationRunId),
    index("reoptimization_events_congestion_check_id_idx").on(table.congestionCheckId),
  ],
);

export const routeLegCongestionCheckTable = pgTable(
  "route_leg_congestion_checks",
  {
    id: serial().primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    routeLegId: integer("route_leg_id").references(() => routeLegTable.id),
    courierId: integer("courier_id").references(() => courierTable.id),
    checkedAt: timestamp("checked_at", { withTimezone: true }).notNull(),
    bboxMinLng: doublePrecision("bbox_min_lng").notNull(),
    bboxMinLat: doublePrecision("bbox_min_lat").notNull(),
    bboxMaxLng: doublePrecision("bbox_max_lng").notNull(),
    bboxMaxLat: doublePrecision("bbox_max_lat").notNull(),
    incidentsFound: integer("incidents_found").notNull().default(0),
    acceptedIncidentCount: integer("accepted_incident_count").notNull().default(0),
    totalDelayInSeconds: integer("total_delay_in_seconds").notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "route_leg_congestion_checks_simulation_id_simulations_id_fk",
    }),
    foreignKey({
      columns: [table.routeLegId],
      foreignColumns: [routeLegTable.id],
      name: "route_leg_congestion_checks_route_leg_id_route_legs_id_fk",
    }),
    foreignKey({
      columns: [table.courierId],
      foreignColumns: [courierTable.id],
      name: "route_leg_congestion_checks_courier_id_couriers_id_fk",
    }),
    index("route_leg_congestion_checks_simulation_id_idx").on(table.simulationId),
    index("route_leg_congestion_checks_route_leg_id_idx").on(table.routeLegId),
    index("route_leg_congestion_checks_courier_id_idx").on(table.courierId),
  ],
);

export const routeLegCongestionCheckIncidentTable = pgTable(
  "route_leg_congestion_check_incidents",
  {
    id: serial().primaryKey(),
    congestionCheckId: integer("congestion_check_id")
      .notNull()
      .references(() => routeLegCongestionCheckTable.id, { onDelete: "cascade" }),
    trafficIncidentId: integer("traffic_incident_id")
      .notNull()
      .references(() => trafficIncidentTable.id, { onDelete: "cascade" }),
    delayInSeconds: integer("delay_in_seconds").notNull(),
    overlapRatio: real("overlap_ratio").notNull(),
    rejectedReasons: jsonb("rejected_reasons").$type<string[]>().notNull().default([]),
    routeIntersects: boolean("route_intersects").notNull().default(false),
    isValidCongestion: boolean("is_valid_congestion").notNull().default(false),
    directionMatches: boolean("direction_matches").notNull().default(false),
    routePointCount: integer("route_point_count"),
    incidentPointCount: integer("incident_point_count"),
    clusterGroup: smallint("cluster_group"),
    delayContributionInSeconds: integer("delay_contribution_in_seconds").notNull().default(0),
    chosenForReopt: boolean("chosen_for_reopt").notNull().default(false),
    delayThresholdInSeconds: integer("delay_threshold_in_seconds").notNull(), // Threshold untuk menentukan apakah delay dari insiden ini cukup signifikan untuk memicu re-optimisasi
    overlapThreshold: real("overlap_threshold").notNull(), // Threshold untuk menentukan apakah overlap antara rute dan insiden cukup signifikan untuk memicu re-optimisasi
    proximityThresholdInMeters: integer("proximity_threshold_in_meters").notNull(), // Threshold untuk menentukan apakah jarak antara rute dan insiden cukup dekat untuk memicu re-optimisasi
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.congestionCheckId],
      foreignColumns: [routeLegCongestionCheckTable.id],
      name: "route_leg_congestion_check_incidents_congestion_check_id_fk",
    }),
    foreignKey({
      columns: [table.trafficIncidentId],
      foreignColumns: [trafficIncidentTable.id],
      name: "route_leg_congestion_check_incidents_traffic_incident_id_fk",
    }),
    index("route_leg_congestion_check_incidents_congestion_check_id_idx").on(
      table.congestionCheckId,
    ),
    index("route_leg_congestion_check_incidents_traffic_incident_id_idx").on(
      table.trafficIncidentId,
    ),
    index("route_leg_congestion_check_incidents_valid_idx").on(
      table.congestionCheckId,
      table.isValidCongestion,
    ),
  ],
);

export const optimizationIterationTable = pgTable(
  "optimization_iterations",
  {
    id: serial("id").primaryKey(),
    simulationId: uuid("simulation_id").references(() => simulationTable.id),
    solutionId: integer("solution_id").references(() => solutionTable.id),
    courierId: integer("courier_id").references(() => courierTable.id),
    eventType: varchar("event_type", { length: 100 }),
    iteration: integer("iteration").notNull(),
    elapsedMs: doublePrecision("elapsed_ms"),
    timestamp: timestamp("timestamp"),
    currentDistanceInMeters: doublePrecision("current_distance_in_meters"),
    currentDurationInSeconds: doublePrecision("current_duration_in_seconds"),
    bestDistanceInMeters: doublePrecision("best_distance_in_meters"),
    bestDurationInSeconds: doublePrecision("best_duration_in_seconds"),
    distanceImprovementInMeters: doublePrecision("distance_improvement_in_meters"),
    durationImprovementInSeconds: doublePrecision("duration_improvement_in_seconds"),
    improvementPercent: doublePrecision("improvement_percent"),
    iterationsWithoutImprovement: integer("iterations_without_improvement"),
    objectiveValue: doublePrecision("objective_value"),
    operatorUsed: varchar("operator_used", { length: 100 }),
    isNewBest: boolean("is_new_best").default(false),
    triggeredDiversification: boolean("triggered_diversification").default(false),
    usedAspirationCriteria: boolean("used_aspiration_criteria").default(false),
    activeRoutesCount: integer("active_routes_count"),
    unassignedNodesCount: integer("unassigned_nodes_count"),
    message: text("message"),
    intermediateTour: jsonb("intermediate_tour").$type<number[]>(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.simulationId],
      foreignColumns: [simulationTable.id],
      name: "optimization_iterations_simulation_id_simulations_id_fk",
    }),
    foreignKey({
      columns: [table.solutionId],
      foreignColumns: [solutionTable.id],
      name: "optimization_iterations_solution_id_solutions_id_fk",
    }),
    foreignKey({
      columns: [table.courierId],
      foreignColumns: [courierTable.id],
      name: "optimization_iterations_courier_id_couriers_id_fk",
    }),
    index("optimization_iterations_simulation_id_idx").on(table.simulationId),
    index("optimization_iterations_event_type_idx").on(table.eventType),
  ],
);

export const tuningExperimentDatasetStatusEnum = pgEnum("tuning_experiment_dataset_status_enum", [
  "uploaded",
  "validating",
  "validated",
  "cleaning",
  "cleaned",
  "geocoding",
  "geocoded",
  "completed",
  "failed",
]);

export const tuningExperimentDatasetTable = pgTable(
  "tuning_experiment_datasets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    filePath: varchar("file_path").notNull(),
    status: tuningExperimentDatasetStatusEnum("status").notNull().default("uploaded"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("tuning_experiment_datasets_status_idx").on(table.status)],
);

export const tuningExperiments = pgTable(
  "tuning_experiments",
  {
    id: serial().primaryKey(),
    datasetId: uuid("dataset_id")
      .references(() => tuningExperimentDatasetTable.id)
      .notNull(),
    baseNc: integer("base_n_c").notNull(),
    itMax: integer("it_max").notNull(),
    tabTenure: integer("tab_tenure").notNull(),
    itCons: integer("it_cons").notNull(),
    itDiv: integer("it_div").notNull(),
    randomSeed: integer("random_seed").default(42).notNull(),
    earlyStopNoImprovementIterations: integer("early_stop_no_improvement_iterations"),
    initialFitnessScore: real("initial_fitness_score"),
    bestFitnessScore: real("best_fitness_score"),
    executionTimeMs: real("execution_time_ms"),
    convergenceIteration: integer("convergence_iteration"),
    improvementPercentage: real("improvement_percentage"),
    bestRoutePayload: jsonb("best_route_payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    foreignKey({
      columns: [table.datasetId],
      foreignColumns: [tuningExperimentDatasetTable.id],
      name: "tuning_experiments_dataset_id_tuning_experiment_datasets_id_fk",
    }),
    index("tuning_experiments_dataset_id_idx").on(table.datasetId),
  ],
);

export const tuningExperimentUploadedRows = pgTable(
  "tuning_experiment_uploaded_rows",
  {
    id: serial().primaryKey(),
    tuningExperimentDatasetId: uuid("tuning_experiment_dataset_id")
      .references(() => tuningExperimentDatasetTable.id)
      .notNull(),
    nosi: varchar("nosi"),
    courier: varchar("courier"),
    customerName: varchar("customer_name"),
    address: varchar("address"),
    normalizedAddress: varchar("normalized_address"),
    suggestedAddress: varchar("suggested_address"),
    finalAddress: varchar("final_address"),
    city: varchar("city"),
    weight: real("weight"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    geocodeScore: doublePrecision("geocode_score"),
    geocodeProvider: varchar("geocode_provider"), // TomTom API
    geocodeResponse: jsonb("geocode_response"),
    startDatetime: timestamp("start_datetime", { withTimezone: true }),
    endDatetime: timestamp("end_datetime", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.tuningExperimentDatasetId],
      foreignColumns: [tuningExperimentDatasetTable.id],
      name: "tuning_experiment_uploaded_rows_tuning_experiment_dataset_id_tuning_experiment_datasets_id_fk",
    }),
    index("tuning_experiment_uploaded_rows_tuning_experiment_dataset_id_idx").on(
      table.tuningExperimentDatasetId,
    ),
    index("tuning_experiment_uploaded_rows_nosi_idx").on(table.nosi),
  ],
);

export const tuningExperimentRunTable = pgTable(
  "tuning_experiment_runs",
  {
    id: serial().primaryKey(),
    tuningExperimentId: integer("tuning_experiment_id")
      .references(() => tuningExperiments.id)
      .notNull(),
    itMax: integer("it_max").notNull(),
    tabTenure: integer("tab_tenure").notNull(),
    itCons: integer("it_cons").notNull(),
    itDiv: integer("it_div").notNull(),
    fitnessScore: real("fitness_score").notNull(),
    executionTimeMs: real("execution_time_ms").notNull(),
    convergenceIteration: integer("convergence_iteration"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.tuningExperimentId],
      foreignColumns: [tuningExperiments.id],
      name: "tuning_experiment_runs_tuning_experiment_id_tuning_experiments_id_fk",
    }),
    index("tuning_experiment_runs_tuning_experiment_id_idx").on(table.tuningExperimentId),
  ],
);
